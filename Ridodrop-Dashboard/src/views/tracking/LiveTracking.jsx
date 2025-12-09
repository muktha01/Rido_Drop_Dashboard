import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
  Paper
} from '@mui/material';
import { IconRefresh, IconMapPin, IconUser, IconPhone, IconCar, IconPackage, IconClock } from '@tabler/icons-react';
import { getAllDrivers } from '../../api/driverApi';
import { buildApiUrl, getApiHeaders } from '../../api/config';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDboH1OPn2tZixD8iFGiH9EJPvzsd4CL2Q';

// Add pulse animation CSS
const pulseAnimation = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

// Inject animation into document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseAnimation;
  document.head.appendChild(style);
}

const LiveTracking = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('online');
  const [filterCity, setFilterCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('liveOrders'); // 'liveOrders' or 'liveTracking'
  const [selectedDriver, setSelectedDriver] = useState(null); // New: Track selected driver for route display
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    withOrders: 0
  });
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]); // New: Track polylines separately
  const routeMarkersRef = useRef([]); // New: Track pickup/drop markers separately
  const lastUpdateRef = useRef(null);

  // Decode Google Maps polyline (same as partner app)
  const decodePolyline = (encoded) => {
    const points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        lat: lat / 1e5,
        lng: lng / 1e5
      });
    }
    return points;
  };

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      script.onerror = () => setError('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize Google Map
  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 28.6139, lng: 77.209 },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true
    });

    googleMapRef.current = map;
    fetchDrivers();
  };

  // Fetch drivers from API
  const fetchDrivers = async (preserveSelection = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllDrivers({ limit: 1000 });

      if (response && response.users) {
        const allDrivers = response.users;
        const totalDrivers = allDrivers.length;
        const onlineDrivers = allDrivers.filter((d) => d.isOnline || d.online || d.onlineStatus === 'online' || d.status === 'online');
        const offlineDrivers = allDrivers.filter((d) => !d.isOnline && !d.online && d.onlineStatus !== 'online' && d.status !== 'online');

        // Fetch ongoing orders for each online driver only
        const onlineDriversWithOrders = await Promise.all(
          onlineDrivers.map(async (driver) => {
            try {
              const driverId = driver._id || driver.id;
              const ongoingOrderUrl = buildApiUrl(`/ongoing-booking?riderId=${driverId}`);

              const orderResponse = await fetch(ongoingOrderUrl, {
                method: 'GET',
                headers: getApiHeaders()
              });

              if (orderResponse.ok) {
                const orderData = await orderResponse.json();
                return {
                  ...driver,
                  currentOrder: orderData.booking || orderData
                };
              }
            } catch (err) {
              console.log(`⚠️ No order for driver ${driver.name || driver._id}`);
            }

            return {
              ...driver,
              currentOrder: null
            };
          })
        );

        // Add offline drivers without orders
        const offlineDriversWithoutOrders = offlineDrivers.map((driver) => ({
          ...driver,
          currentOrder: null
        }));

        // Combine both online and offline drivers
        const allDriversWithOrders = [...onlineDriversWithOrders, ...offlineDriversWithoutOrders];

        const withOrders = onlineDriversWithOrders.filter((d) => d.currentOrder).length;

        // Extract unique cities from all drivers
        const cities = [...new Set(allDriversWithOrders.map((d) => d.selectCity || d.city).filter(Boolean))].sort();
        setAvailableCities(cities);

        setStats({
          total: totalDrivers,
          online: onlineDrivers.length,
          offline: offlineDrivers.length,
          withOrders: withOrders
        });

        setDrivers(allDriversWithOrders);
        setFilteredDrivers(allDriversWithOrders);
        updateMapMarkers(allDriversWithOrders);
        lastUpdateRef.current = new Date();
        
        // Restore selected driver's route after refresh
        if (preserveSelection && selectedDriver) {
          const updatedSelectedDriver = allDriversWithOrders.find(d => d._id === selectedDriver._id);
          if (updatedSelectedDriver && updatedSelectedDriver.currentOrder) {
            setSelectedDriver(updatedSelectedDriver);
            setTimeout(() => {
              showDriverRoute(updatedSelectedDriver);
            }, 500);
          }
        }
      }
    } catch (err) {
      console.error('❌ Error fetching drivers:', err);
      setError('Failed to load driver data');
    } finally {
      setLoading(false);
    }
  };

  // Update map markers
  const updateMapMarkers = (driverList) => {
    if (!googleMapRef.current || !window.google) return;

    // Clear existing markers (but NOT polylines and route markers - they're managed separately)
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    driverList.forEach((driver) => {
      const isOnline = driver.isOnline || driver.online || driver.onlineStatus === 'online';
      const currentOrder = driver.currentOrder;

      // Show drivers based on the current filter status
      // If filterStatus is 'online', only show online drivers
      // If filterStatus is 'offline', only show offline drivers
      // If filterStatus is 'all', show all drivers
      if (filterStatus === 'online' && !isOnline) {
        return;
      }
      if (filterStatus === 'offline' && isOnline) {
        return;
      }

      let driverLat, driverLng, pickupLat, pickupLng, dropLat, dropLng;
      let locationSource = null;

      // Get driver's real-time location
      if (driver.currentLocation && driver.currentLocation.coordinates) {
        const coords = driver.currentLocation.coordinates;
        if (Array.isArray(coords) && coords.length === 2) {
          [driverLng, driverLat] = coords;
          if (driverLat !== 0 && driverLng !== 0) {
            locationSource = 'real-time';
          }
        }
      }

      // Fallback locations
      if (!driverLat || !driverLng || (driverLat === 0 && driverLng === 0)) {
        if (driver.location?.coordinates) {
          [driverLng, driverLat] = driver.location.coordinates;
          if (driverLat !== 0 && driverLng !== 0) {
            locationSource = 'location-field';
          }
        } else if (driver.latitude && driver.longitude) {
          driverLat = driver.latitude;
          driverLng = driver.longitude;
          if (driverLat !== 0 && driverLng !== 0) {
            locationSource = 'lat-lng-field';
          }
        }
      }

      // Get order locations
      if (currentOrder) {
        if (currentOrder.from?.latitude && currentOrder.from?.longitude) {
          pickupLat = currentOrder.from.latitude;
          pickupLng = currentOrder.from.longitude;
        } else if (currentOrder.fromAddress?.latitude && currentOrder.fromAddress?.longitude) {
          pickupLat = currentOrder.fromAddress.latitude;
          pickupLng = currentOrder.fromAddress.longitude;
        }

        if (currentOrder.to?.latitude && currentOrder.to?.longitude) {
          dropLat = currentOrder.to.latitude;
          dropLng = currentOrder.to.longitude;
        } else if (currentOrder.dropLocation?.[0]?.latitude && currentOrder.dropLocation?.[0]?.longitude) {
          dropLat = currentOrder.dropLocation[0].latitude;
          dropLng = currentOrder.dropLocation[0].longitude;
        }
      }

      if (!driverLat || !driverLng) {
        return;
      }

      const position = { lat: parseFloat(driverLat), lng: parseFloat(driverLng) };

      // Driver marker icon
      const driverIcon = {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="20" cy="20" r="18" fill="${isOnline ? '#4CAF50' : '#9E9E9E'}" opacity="0.3"/>
            <circle cx="20" cy="20" r="12" fill="${isOnline ? '#4CAF50' : '#9E9E9E'}" stroke="white" stroke-width="3" filter="url(#glow)"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20)
      };

      const driverMarker = new window.google.maps.Marker({
        position,
        map: googleMapRef.current,
        title: driver.name || driver.fullName || 'Driver',
        icon: driverIcon,
        animation: window.google.maps.Animation.DROP,
        zIndex: 100
      });

      const lastUpdate = driver.lastLocationUpdate || driver.lastSeen || driver.updatedAt;
      const orderInfo = currentOrder
        ? `
        <div style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin-top: 8px;">
          <p style="margin: 4px 0; font-size: 12px; font-weight: 600; color: #2196F3;">📦 Active Order</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>ID:</strong> ${currentOrder.bookingId || currentOrder._id?.slice(-6) || 'N/A'}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Status:</strong> <span style="color: #2196F3; font-weight: bold;">${currentOrder.status || currentOrder.bookingStatus || 'N/A'}</span></p>
        </div>
      `
        : '<p style="margin: 4px 0; font-size: 12px; color: #9E9E9E; font-style: italic;">No active order</p>';

      const driverInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; font-family: 'Roboto', sans-serif; min-width: 250px;">
            <h3 style="margin: 0 0 10px 0; color: #EC4D4A; font-size: 16px; display: flex; align-items: center; gap: 6px;">
              🚗 ${driver.name || driver.fullName || 'Driver'}
              <span style="background: ${isOnline ? '#4CAF50' : '#9E9E9E'}; width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>
            </h3>
            <div style="background: #fafafa; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
              <p style="margin: 4px 0; font-size: 12px;"><strong>📞 Phone:</strong> ${driver.phone || driver.mobile || 'N/A'}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>🚙 Vehicle:</strong> ${driver.vehicleType || 'N/A'}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>🔢 Reg No:</strong> ${driver.vehicleregisterNumber || driver.vehicleNumber || 'N/A'}</p>
              ${lastUpdate ? `<p style="margin: 4px 0; font-size: 11px; color: #666;"><strong>🕐 Last Update:</strong> ${new Date(lastUpdate).toLocaleTimeString()}</p>` : ''}
            </div>
            ${orderInfo}
          </div>
        `
      });

      driverMarker.addListener('click', () => {
        markersRef.current.forEach((m) => m.infoWindow?.close());
        driverInfoWindow.open(googleMapRef.current, driverMarker);
      });

      driverMarker.infoWindow = driverInfoWindow;
      markersRef.current.push(driverMarker);
      bounds.extend(position);

      // NOTE: Removed automatic polyline rendering
      // Polylines are now only shown when clicking on a driver from the sidebar
    });

    // Fit map to show all markers
    if (driverList.length > 0 && markersRef.current.length > 0) {
      googleMapRef.current.fitBounds(bounds);
      const listener = window.google.maps.event.addListener(googleMapRef.current, 'idle', () => {
        if (googleMapRef.current.getZoom() > 15) googleMapRef.current.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    }
  };

  // New function: Show route polyline for selected driver with multiple drop support
  const showDriverRoute = (driver) => {
    if (!googleMapRef.current || !window.google) return;

    // Clear previous route markers and polylines
    routeMarkersRef.current.forEach((marker) => marker.setMap(null));
    routeMarkersRef.current = [];
    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    polylinesRef.current = [];

    const currentOrder = driver.currentOrder;
    if (!currentOrder) {
      console.log('No active order for this driver');
      return;
    }

    // Get rider's current location
    let riderLat, riderLng;
    if (driver.currentLocation && driver.currentLocation.coordinates) {
      const coords = driver.currentLocation.coordinates;
      if (Array.isArray(coords) && coords.length === 2) {
        [riderLng, riderLat] = coords;
      }
    }

    // Fallback to other location fields
    if (!riderLat || !riderLng || (riderLat === 0 && riderLng === 0)) {
      if (driver.location?.coordinates) {
        [riderLng, riderLat] = driver.location.coordinates;
      } else if (driver.latitude && driver.longitude) {
        riderLat = driver.latitude;
        riderLng = driver.longitude;
      }
    }

    if (!riderLat || !riderLng) {
      console.log('Missing rider location data');
      return;
    }

    let pickupLat, pickupLng;

    // Get pickup location
    if (currentOrder.from?.latitude && currentOrder.from?.longitude) {
      pickupLat = currentOrder.from.latitude;
      pickupLng = currentOrder.from.longitude;
    } else if (currentOrder.fromAddress?.latitude && currentOrder.fromAddress?.longitude) {
      pickupLat = currentOrder.fromAddress.latitude;
      pickupLng = currentOrder.fromAddress.longitude;
    }

    // Get all drop locations (handle both array and single object)
    let dropLocations = [];
    if (Array.isArray(currentOrder.dropLocation)) {
      dropLocations = currentOrder.dropLocation.filter(drop => drop?.latitude && drop?.longitude);
    } else if (currentOrder.to?.latitude && currentOrder.to?.longitude) {
      dropLocations = [currentOrder.to];
    } else if (currentOrder.dropLocation?.latitude && currentOrder.dropLocation?.longitude) {
      dropLocations = [currentOrder.dropLocation];
    }

    if (dropLocations.length === 0) {
      console.log('Missing drop location data');
      return;
    }

    console.log(`📦 Order has ${dropLocations.length} drop location(s)`);
    dropLocations.forEach((drop, idx) => {
      console.log(`  Drop ${idx + 1}: ${drop.Address || drop.address || 'N/A'}`);
    });

    console.log(`📦 Order has ${dropLocations.length} drop location(s)`);
    dropLocations.forEach((drop, idx) => {
      console.log(`  Drop ${idx + 1}: ${drop.Address || drop.address || 'N/A'}`);
    });

    const bounds = new window.google.maps.LatLngBounds();

    // Create Rider's Current Location marker (like partner app)
    const riderPosition = { lat: parseFloat(riderLat), lng: parseFloat(riderLng) };
    const riderIcon = {
      url:
        'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
          </defs>
          <circle cx="24" cy="24" r="22" fill="white" filter="url(#shadow)"/>
          <circle cx="24" cy="24" r="18" fill="#EC4D4A"/>
          <path d="M24 10 L28 22 L24 34 L20 22 Z" fill="white" stroke="white" stroke-width="2"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(48, 48),
      anchor: new window.google.maps.Point(24, 24)
    };

    const riderMarker = new window.google.maps.Marker({
      position: riderPosition,
      map: googleMapRef.current,
      title: `${driver.name || 'Rider'} - Current Location`,
      icon: riderIcon,
      zIndex: 1001,
      animation: window.google.maps.Animation.DROP
    });

    const riderInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; font-family: 'Roboto', sans-serif;">
          <h4 style="margin: 0 0 8px 0; color: #EC4D4A; font-size: 14px;">🏍️ ${driver.name || 'Rider'} - Current Location</h4>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Status:</strong> ${currentOrder.status || 'Active'}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Vehicle:</strong> ${driver.vehicleregisterNumber || 'N/A'}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Drops:</strong> ${dropLocations.length} location(s)</p>
          <p style="margin: 4px 0; font-size: 11px; color: #666;">Real-time location</p>
        </div>
      `
    });

    riderMarker.addListener('click', () => {
      riderInfoWindow.open(googleMapRef.current, riderMarker);
    });

    routeMarkersRef.current.push(riderMarker);
    bounds.extend(riderPosition);

    // Only show pickup marker if we have pickup coordinates
    if (pickupLat && pickupLng) {
      const pickupPosition = { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) };
      const pickupIcon = {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" fill="#4CAF50"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 40),
        anchor: new window.google.maps.Point(16, 40)
      };

      const pickupMarker = new window.google.maps.Marker({
        position: pickupPosition,
        map: googleMapRef.current,
        title: 'Pickup Location',
        icon: pickupIcon,
        zIndex: 50
      });

      const pickupInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: 'Roboto', sans-serif;">
            <h4 style="margin: 0 0 8px 0; color: #4CAF50; font-size: 14px;">📍 Pickup Location</h4>
            <p style="margin: 4px 0; font-size: 12px;">${currentOrder.from?.address || currentOrder.fromAddress?.address || 'Pickup Address'}</p>
          </div>
        `
      });

      pickupMarker.addListener('click', () => {
        pickupInfoWindow.open(googleMapRef.current, pickupMarker);
      });

      routeMarkersRef.current.push(pickupMarker);
      bounds.extend(pickupPosition);
    }

    // Create numbered drop markers for all drop locations
    dropLocations.forEach((drop, index) => {
      const dropPosition = { lat: parseFloat(drop.latitude), lng: parseFloat(drop.longitude) };
      
      // Create numbered marker icon
      const dropIcon = {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" fill="#EC4D4A"/>
            <circle cx="16" cy="16" r="10" fill="white"/>
            <text x="16" y="20" font-size="12" font-weight="bold" text-anchor="middle" fill="#EC4D4A">${index + 1}</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 40),
        anchor: new window.google.maps.Point(16, 40)
      };

      const dropMarker = new window.google.maps.Marker({
        position: dropPosition,
        map: googleMapRef.current,
        title: `Drop Location ${index + 1}`,
        icon: dropIcon,
        zIndex: 100 + index
      });

      const dropInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: 'Roboto', sans-serif;">
            <h4 style="margin: 0 0 8px 0; color: #EC4D4A; font-size: 14px;">📍 Drop Location ${index + 1} of ${dropLocations.length}</h4>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${drop.Address || drop.address || 'Drop Address'}</p>
            ${drop.ReciversName || drop.ReceiverName || drop.receiverName ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Receiver:</strong> ${drop.ReciversName || drop.ReceiverName || drop.receiverName}</p>` : ''}
            ${drop.ReciversMobileNum || drop.ReceiverMobile || drop.receiverMobile ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Phone:</strong> ${drop.ReciversMobileNum || drop.ReceiverMobile || drop.receiverMobile}</p>` : ''}
          </div>
        `
      });

      dropMarker.addListener('click', () => {
        dropInfoWindow.open(googleMapRef.current, dropMarker);
      });

      routeMarkersRef.current.push(dropMarker);
      bounds.extend(dropPosition);
    });

    // Use DirectionsService with waypoints for multiple drops
    console.log('🚗 Fetching Google Directions via JavaScript API...');
    console.log('📍 From (Rider):', riderPosition);
    console.log(`📍 To: ${dropLocations.length} drop location(s)`);
    
    const directionsService = new window.google.maps.DirectionsService();

    // Build waypoints array for all drops except the last one
    const waypoints = dropLocations.slice(0, -1).map((drop, index) => ({
      location: { lat: parseFloat(drop.latitude), lng: parseFloat(drop.longitude) },
      stopover: true
    }));

    // Last drop is the destination
    const finalDrop = dropLocations[dropLocations.length - 1];
    const destination = { lat: parseFloat(finalDrop.latitude), lng: parseFloat(finalDrop.longitude) };

    const request = {
      origin: riderPosition,
      destination: destination,
      waypoints: waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false // Keep order as-is
    };

    console.log(`🛣️ Route: Rider → ${waypoints.length > 0 ? waypoints.length + ' stops → ' : ''}Final Drop`);

    directionsService.route(request, (result, status) => {
      console.log('📡 Directions API response status:', status);
      
      if (status === window.google.maps.DirectionsStatus.OK) {
        console.log('✅ Directions API succeeded!');
        
        // Extract the path from the directions result
        const route = result.routes[0];
        const allPaths = [];
        
        // Get all the points from all legs (each leg = one segment between stops)
        route.legs.forEach((leg, legIndex) => {
          console.log(`  Leg ${legIndex + 1}: ${leg.distance.text}, ${leg.duration.text}`);
          
          const legPath = [];
          leg.steps.forEach((step) => {
            step.path.forEach((point) => {
              legPath.push(point);
            });
          });
          
          // Draw polyline for this leg with different color for each segment
          const colors = ['#EC4D4A', '#FF6B6B', '#FF8787', '#FFA3A3', '#FFBFBF'];
          const color = colors[legIndex % colors.length];
          
          const routeLine = new window.google.maps.Polyline({
            path: legPath,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: googleMapRef.current,
            zIndex: 100 - legIndex
          });

          polylinesRef.current.push(routeLine);
          allPaths.push(...legPath);
        });
        
        console.log(`✅ Route has ${route.legs.length} leg(s) with ${allPaths.length} total coordinate points`);
        console.log('✅ Polylines drawn successfully with complete route through all drops');
      } else {
        console.warn('⚠️ Directions API failed with status:', status);
        console.warn('⚠️ This might be due to API key restrictions or quota limits');
      }
      
      // Fit map to show the route
      googleMapRef.current.fitBounds(bounds);
      
      // Adjust zoom if too close
      const listener = window.google.maps.event.addListener(googleMapRef.current, 'idle', () => {
        if (googleMapRef.current.getZoom() > 15) googleMapRef.current.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    });
  };

  // Filter drivers by status, city, and search query
  useEffect(() => {
    let filtered = [...drivers];

    // Filter by status
    if (filterStatus === 'online') {
      filtered = filtered.filter((d) => d.isOnline || d.online || d.onlineStatus === 'online');
    } else if (filterStatus === 'offline') {
      filtered = filtered.filter((d) => !d.isOnline && !d.online && d.onlineStatus !== 'online');
    }

    // Filter by city
    if (filterCity && filterCity !== 'all') {
      filtered = filtered.filter((d) => (d.selectCity || d.city) === filterCity);
    }

    // Filter by search query (name or phone)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (d) =>
          d.name?.toLowerCase().includes(query) ||
          d.phone?.includes(query) ||
          d.mobile?.includes(query) ||
          d.email?.toLowerCase().includes(query)
      );
    }

    setFilteredDrivers(filtered);
    updateMapMarkers(filtered);

    // Only clear route if filters actually changed (not just data refresh)
    // Don't clear if we're just refreshing driver data
    if (!selectedDriver || 
        (filterStatus && filtered.findIndex(d => d._id === selectedDriver._id) === -1) ||
        (filterCity && selectedDriver.selectCity !== filterCity) ||
        (searchQuery && !selectedDriver.name?.toLowerCase().includes(searchQuery.toLowerCase()))) {
      routeMarkersRef.current.forEach((marker) => marker.setMap(null));
      routeMarkersRef.current = [];
      polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      polylinesRef.current = [];
      setSelectedDriver(null);
    }
  }, [filterStatus, filterCity, searchQuery, drivers, viewMode]); // Added viewMode to dependencies

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchDrivers(true); // Pass true to preserve selected driver
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [loading, selectedDriver]); // Add selectedDriver as dependency

  const handleRefresh = () => {
    fetchDrivers();
  };

  const getDriverName = (driver) => {
    if (driver.fullName) return driver.fullName;
    if (driver.name && driver.lname) return `${driver.name} ${driver.lname}`;
    if (driver.name) return driver.name;
    return 'Unknown Driver';
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Full Page Map */}
      <Box
        ref={mapRef}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Floating Statistics Header */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: sidebarOpen ? 420 : 16,
          zIndex: 1000,
          display: 'flex',
          gap: 2,
          transition: 'right 0.3s ease'
        }}
      >
        <Paper elevation={3} sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#667eea', width: 48, height: 48 }}>
              <IconUser size={24} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                {stats.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Drivers
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#4CAF50', width: 48, height: 48 }}>
              <IconMapPin size={24} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                {stats.online}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Online Now
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#2196F3', width: 48, height: 48 }}>
              <IconPackage size={24} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#2196F3' }}>
                {stats.withOrders}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active Orders
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Floating Control Panel */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 100,
          left: 16,
          zIndex: 1000,
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {/* View Mode Toggle Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mr: 1, borderRight: '1px solid #e0e0e0', pr: 1 }}>
          <Tooltip title="Show pickup and drop locations with routes">
            <IconButton
              size="small"
              onClick={() => setViewMode('liveOrders')}
              sx={{
                bgcolor: viewMode === 'liveOrders' ? '#2196F3' : 'transparent',
                color: viewMode === 'liveOrders' ? 'white' : '#666',
                '&:hover': {
                  bgcolor: viewMode === 'liveOrders' ? '#1976D2' : '#f5f5f5'
                },
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: viewMode === 'liveOrders' ? 600 : 400
              }}
            >
              <IconPackage size={16} style={{ marginRight: 4 }} />
              Live Orders
            </IconButton>
          </Tooltip>
          <Tooltip title="Show only online driver locations">
            <IconButton
              size="small"
              onClick={() => setViewMode('liveTracking')}
              sx={{
                bgcolor: viewMode === 'liveTracking' ? '#4CAF50' : 'transparent',
                color: viewMode === 'liveTracking' ? 'white' : '#666',
                '&:hover': {
                  bgcolor: viewMode === 'liveTracking' ? '#388E3C' : '#f5f5f5'
                },
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: viewMode === 'liveTracking' ? 600 : 400
              }}
            >
              <IconMapPin size={16} style={{ marginRight: 4 }} />
              Live Tracking
            </IconButton>
          </Tooltip>
        </Box>

        <TextField select size="small" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="all">All Drivers</MenuItem>
          <MenuItem value="online">🟢 Online Only</MenuItem>
          <MenuItem value="offline">⚫ Offline Only</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          sx={{ minWidth: 150 }}
          placeholder="Filter by City"
        >
          <MenuItem value="all">All Cities</MenuItem>
          {availableCities.map((city) => (
            <MenuItem key={city} value={city}>
              📍 {city}
            </MenuItem>
          ))}
        </TextField>

        <Chip
          label={loading ? 'Updating...' : 'Live'}
          color={loading ? 'default' : 'success'}
          size="small"
          sx={{
            fontWeight: 600,
            animation: loading ? 'none' : 'pulse 2s infinite'
          }}
        />

        <Tooltip title="Refresh Now">
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            sx={{ bgcolor: '#EC4D4A', color: 'white', '&:hover': { bgcolor: '#d43d3a' } }}
          >
            <IconRefresh size={20} />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Map Legend */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          zIndex: 1000,
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#4CAF50', border: '2px solid white', boxShadow: 1 }} />
          <Typography variant="caption" fontWeight={500}>
            Online Driver
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#EC4D4A', border: '2px solid white', boxShadow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderBottom: '6px solid white' }} />
          </Box>
          <Typography variant="caption" fontWeight={500}>
            Rider Location
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '12px solid #4CAF50'
            }}
          />
          <Typography variant="caption" fontWeight={500}>
            Pickup
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '12px solid #EC4D4A'
            }}
          />
          <Typography variant="caption" fontWeight={500}>
            Drop
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 2, bgcolor: '#EC4D4A', opacity: 0.8 }} />
          <Typography variant="caption" fontWeight={500}>
            Route to Drop
          </Typography>
        </Box>
      </Paper>

      {/* Toggle Sidebar Button */}
      <IconButton
        onClick={() => setSidebarOpen(!sidebarOpen)}
        sx={{
          position: 'absolute',
          top: '50%',
          right: sidebarOpen ? 396 : 16,
          transform: 'translateY(-50%)',
          zIndex: 1001,
          bgcolor: '#EC4D4A',
          color: 'white',
          '&:hover': { bgcolor: '#d43d3a' },
          transition: 'right 0.3s ease',
          boxShadow: 3
        }}
      >
        <IconMapPin size={20} />
      </IconButton>

      {/* Floating Driver List Sidebar */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 16,
          right: sidebarOpen ? 16 : -400,
          bottom: 16,
          width: 380,
          zIndex: 1000,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'right 0.3s ease'
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid #e0e0e0', bgcolor: '#EC4D4A' }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconMapPin size={24} />
            Live Tracking
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {filteredDrivers.length} driver{filteredDrivers.length !== 1 ? 's' : ''} •{' '}
            {lastUpdateRef.current && lastUpdateRef.current.toLocaleTimeString()}
          </Typography>
          {selectedDriver && selectedDriver.currentOrder && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.2)', px: 1, py: 0.5, borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                🗺️ Showing route for: {getDriverName(selectedDriver)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f5f5f5' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <IconUser size={18} color="#666" />
                </Box>
              )
            }}
            sx={{
              bgcolor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ddd'
                },
                '&:hover fieldset': {
                  borderColor: '#EC4D4A'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#EC4D4A'
                }
              }
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Driver List */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {loading && drivers.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : filteredDrivers.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              No {filterStatus} drivers found
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredDrivers.map((driver) => {
                const isOnline = driver.isOnline || driver.online || driver.onlineStatus === 'online';
                const currentOrder = driver.currentOrder;
                const lastUpdate = driver.lastLocationUpdate || driver.lastSeen;

                return (
                  <Card
                    key={driver._id || driver.id}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      borderLeft: `4px solid ${isOnline ? '#4CAF50' : '#9E9E9E'}`,
                      bgcolor: selectedDriver?._id === driver._id ? 'rgba(236, 77, 74, 0.08)' : 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                        cursor: 'pointer',
                        borderColor: '#EC4D4A'
                      }
                    }}
                    onClick={() => {
                      let lat, lng;

                      if (driver.currentLocation?.coordinates) {
                        [lng, lat] = driver.currentLocation.coordinates;
                      } else if (currentOrder?.from) {
                        lat = currentOrder.from.latitude;
                        lng = currentOrder.from.longitude;
                      } else if (driver.location?.coordinates) {
                        [lng, lat] = driver.location.coordinates;
                      } else if (driver.latitude && driver.longitude) {
                        lat = driver.latitude;
                        lng = driver.longitude;
                      }

                      if (lat && lng && googleMapRef.current) {
                        googleMapRef.current.setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
                        googleMapRef.current.setZoom(16);
                      }

                      // Set selected driver
                      setSelectedDriver(driver);
                      
                      // Show route polyline if driver has an active order
                      if (currentOrder) {
                        console.log('🗺️ Showing route for driver:', getDriverName(driver), 'with active order');
                        showDriverRoute(driver);
                      } else {
                        // Clear route if no active order
                        console.log('ℹ️ No active order for:', getDriverName(driver));
                        routeMarkersRef.current.forEach((marker) => marker.setMap(null));
                        routeMarkersRef.current = [];
                        polylinesRef.current.forEach((polyline) => polyline.setMap(null));
                        polylinesRef.current = [];
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: isOnline ? '#4CAF50' : '#9E9E9E',
                                border: '2px solid white'
                              }}
                            />
                          }
                        >
                          <Avatar
                            sx={{
                              bgcolor: isOnline ? '#4CAF50' : '#9E9E9E',
                              width: 48,
                              height: 48,
                              fontSize: '1.2rem'
                            }}
                          >
                            {(driver.name || 'D').charAt(0).toUpperCase()}
                          </Avatar>
                        </Badge>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}>
                            {getDriverName(driver)}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                            <IconPhone size={12} style={{ color: '#666' }} />
                            <Typography variant="caption" color="text.secondary">
                              {driver.phone || driver.mobile || 'N/A'}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                            <IconCar size={12} style={{ color: '#666' }} />
                            <Typography variant="caption" color="text.secondary">
                              {driver.vehicleType || 'N/A'}
                              {driver.vehicleSubType && ` - ${driver.vehicleSubType}`}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.8 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                              🔢 {driver.vehicleregisterNumber || driver.vehicleNumber || 'No Reg'}
                            </Typography>
                          </Box>

                          {currentOrder && (
                            <Box
                              sx={{
                                mt: 1,
                                p: 1,
                                bgcolor: '#E3F2FD',
                                borderRadius: 1,
                                borderLeft: '3px solid #2196F3'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                                <IconPackage size={12} color="#2196F3" />
                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#2196F3' }}>
                                  Order #{currentOrder.bookingId || currentOrder._id?.slice(-6)}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                                {currentOrder.status || currentOrder.bookingStatus || 'Active'}
                              </Typography>
                            </Box>
                          )}

                          {lastUpdate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                              <IconClock size={11} style={{ color: '#999' }} />
                              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#999' }}>
                                {new Date(lastUpdate).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            <Chip
                              label={isOnline ? 'Online' : 'Offline'}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: isOnline ? '#4CAF50' : '#9E9E9E',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                            {currentOrder && (
                              <Chip
                                label="Active Order"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  bgcolor: '#2196F3',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            )}
                            {selectedDriver?._id === driver._id && currentOrder && (
                              <Chip
                                label="🗺️ Route Shown"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  bgcolor: '#EC4D4A',
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default LiveTracking;
