import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, IconButton, Chip, Avatar, Divider, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import { Close as CloseIcon, MyLocation as MyLocationIcon, Phone as PhoneIcon, DirectionsCar as CarIcon } from '@mui/icons-material';
import { buildApiUrl, getApiHeaders } from '../../api/config';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDG48YF2dsvPN0qHX3_vSaTJj6aqg3-Oc4';

const OrderLiveTracking = ({ order, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riderData, setRiderData] = useState(null);
  const [orderData, setOrderData] = useState(order);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

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

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      fetchRiderLocation();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 28.6139, lng: 77.209 },
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true
    });

    googleMapRef.current = map;
    fetchRiderLocation();
  };

  // Fetch rider's current location
  const fetchRiderLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Full order data:', orderData);
      console.log('🔍 Order _raw:', orderData?._raw);

      // Try multiple ways to get rider phone number
      let riderPhone = null;

      // Method 1: Check if rider data is populated with phone
      if (orderData?._raw?.rider?.phone) {
        riderPhone = orderData._raw.rider.phone;
        console.log('✅ Found rider phone in _raw.rider.phone:', riderPhone);
      }
      // Method 2: Check direct rider.phone
      else if (orderData?.rider?.phone) {
        riderPhone = orderData.rider.phone;
        console.log('✅ Found rider phone in rider.phone:', riderPhone);
      }
      // Method 3: Check if riderId contains phone (sometimes it's stored as string)
      else if (orderData?._raw?.riderId && typeof orderData._raw.riderId === 'string' && orderData._raw.riderId.match(/^\d{10,}$/)) {
        riderPhone = orderData._raw.riderId;
        console.log('✅ Found rider phone as riderId string:', riderPhone);
      }
      // Method 4: Check riderId.phone
      else if (orderData?._raw?.riderId?.phone) {
        riderPhone = orderData._raw.riderId.phone;
        console.log('✅ Found rider phone in _raw.riderId.phone:', riderPhone);
      }
      // Method 5: Check direct driverPhone field
      else if (orderData?.driverPhone || orderData?._raw?.driverPhone) {
        riderPhone = orderData.driverPhone || orderData._raw.driverPhone;
        console.log('✅ Found rider phone in driverPhone:', riderPhone);
      }

      if (!riderPhone) {
        console.error('❌ Could not find rider phone in order data:', {
          _raw: orderData?._raw,
          rider: orderData?.rider,
          riderId: orderData?.riderId,
          driverPhone: orderData?.driverPhone
        });
        setError('No rider assigned to this order or rider phone not found');
        setLoading(false);
        return;
      }

      // Fetch rider details using phone number
      const riderUrl = buildApiUrl(`/riders/get/rider?number=${riderPhone}`);
      console.log('📞 Fetching rider by phone:', riderUrl);

      const response = await fetch(riderUrl, {
        method: 'GET',
        headers: getApiHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Rider fetch failed:', errorText);
        throw new Error(`Failed to fetch rider location: ${response.status}`);
      }

      const riderInfo = await response.json();
      console.log('📍 Rider location data:', riderInfo);

      setRiderData(riderInfo);
      updateMapMarkers(riderInfo);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching rider location:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Update map with markers
  const updateMapMarkers = (rider) => {
    if (!googleMapRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    // Get locations
    let riderLat, riderLng, pickupLat, pickupLng, dropLat, dropLng;

    console.log('📍 Extracting locations from order:', {
      from: orderData?.from,
      _raw_from: orderData?._raw?.from,
      _raw_fromAddress: orderData?._raw?.fromAddress,
      to: orderData?.to,
      _raw_to: orderData?._raw?.to,
      _raw_dropLocation: orderData?._raw?.dropLocation
    });

    // Rider's current location
    if (rider.currentLocation?.coordinates) {
      [riderLng, riderLat] = rider.currentLocation.coordinates;
    } else if (rider.location?.coordinates) {
      [riderLng, riderLat] = rider.location.coordinates;
    }

    // Pickup location - try multiple field variations
    if (orderData?.from?.latitude && orderData?.from?.longitude) {
      pickupLat = orderData.from.latitude;
      pickupLng = orderData.from.longitude;
    } else if (orderData?._raw?.from?.latitude && orderData?._raw?.from?.longitude) {
      pickupLat = orderData._raw.from.latitude;
      pickupLng = orderData._raw.from.longitude;
    } else if (orderData?._raw?.fromAddress?.latitude && orderData?._raw?.fromAddress?.longitude) {
      pickupLat = orderData._raw.fromAddress.latitude;
      pickupLng = orderData._raw.fromAddress.longitude;
    }

    console.log('📍 Pickup coordinates:', { pickupLat, pickupLng });

    // Drop location - try multiple field variations
    if (orderData?.to?.latitude && orderData?.to?.longitude) {
      dropLat = orderData.to.latitude;
      dropLng = orderData.to.longitude;
    } else if (orderData?._raw?.to?.latitude && orderData?._raw?.to?.longitude) {
      dropLat = orderData._raw.to.latitude;
      dropLng = orderData._raw.to.longitude;
    } else if (orderData?._raw?.dropLocation?.[0]?.latitude && orderData?._raw?.dropLocation?.[0]?.longitude) {
      dropLat = orderData._raw.dropLocation[0].latitude;
      dropLng = orderData._raw.dropLocation[0].longitude;
    }

    console.log('📍 Drop coordinates:', { dropLat, dropLng });

    // Add rider marker
    if (riderLat && riderLng) {
      const riderPosition = { lat: parseFloat(riderLat), lng: parseFloat(riderLng) };

      const riderIcon = {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#4CAF50" opacity="0.3"/>
              <circle cx="20" cy="20" r="12" fill="#4CAF50" stroke="white" stroke-width="3"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🚗</text>
            </svg>
          `),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20)
      };

      const riderMarker = new window.google.maps.Marker({
        position: riderPosition,
        map: googleMapRef.current,
        title: 'Driver Location',
        icon: riderIcon,
        animation: window.google.maps.Animation.BOUNCE,
        zIndex: 100
      });

      const riderInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; font-family: 'Roboto', sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #4CAF50;">🚗 Driver Current Location</h3>
            <p style="margin: 4px 0;"><strong>Name:</strong> ${rider.name || 'N/A'}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${rider.phone || 'N/A'}</p>
            <p style="margin: 4px 0;"><strong>Vehicle:</strong> ${rider.vehicleType || 'N/A'}</p>
            <p style="margin: 4px 0; font-size: 11px; color: #666;">📍 Real-time location</p>
          </div>
        `
      });

      riderMarker.addListener('click', () => {
        riderInfoWindow.open(googleMapRef.current, riderMarker);
      });

      markersRef.current.push(riderMarker);
      bounds.extend(riderPosition);

      // Auto-open info window for rider
      setTimeout(() => {
        riderInfoWindow.open(googleMapRef.current, riderMarker);
      }, 500);
    }

    // Add pickup marker
    if (pickupLat && pickupLng) {
      const pickupPosition = { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) };

      const pickupIcon = {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" fill="#2196F3"/>
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
            <h4 style="margin: 0 0 8px 0; color: #2196F3;">📍 Pickup Location</h4>
            <p style="margin: 4px 0; font-size: 12px;">${orderData?.from?.address || orderData?._raw?.from?.address || 'Pickup Address'}</p>
          </div>
        `
      });

      pickupMarker.addListener('click', () => {
        pickupInfoWindow.open(googleMapRef.current, pickupMarker);
      });

      markersRef.current.push(pickupMarker);
      bounds.extend(pickupPosition);
    }

    // Add drop marker
    if (dropLat && dropLng) {
      const dropPosition = { lat: parseFloat(dropLat), lng: parseFloat(dropLng) };

      const dropIcon = {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" fill="#EC4D4A"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
          `),
        scaledSize: new window.google.maps.Size(32, 40),
        anchor: new window.google.maps.Point(16, 40)
      };

      const dropMarker = new window.google.maps.Marker({
        position: dropPosition,
        map: googleMapRef.current,
        title: 'Drop Location',
        icon: dropIcon,
        zIndex: 50
      });

      const dropInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: 'Roboto', sans-serif;">
            <h4 style="margin: 0 0 8px 0; color: #EC4D4A;">📍 Drop Location</h4>
            <p style="margin: 4px 0; font-size: 12px;">${orderData?.to?.Address || orderData?._raw?.to?.Address || orderData?._raw?.dropLocation?.[0]?.Address || 'Drop Address'}</p>
          </div>
        `
      });

      dropMarker.addListener('click', () => {
        dropInfoWindow.open(googleMapRef.current, dropMarker);
      });

      markersRef.current.push(dropMarker);
      bounds.extend(dropPosition);
    }

    // Draw actual road route from pickup to drop using Directions API
    if (pickupLat && pickupLng && dropLat && dropLng) {
      const directionsService = new window.google.maps.DirectionsService();

      const pickupLocation = { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) };
      const dropLocation = { lat: parseFloat(dropLat), lng: parseFloat(dropLng) };

      const request = {
        origin: pickupLocation,
        destination: dropLocation,
        travelMode: window.google.maps.TravelMode.DRIVING
      };

      console.log('🛣️ Requesting route from Directions API:', request);

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const routePath = result.routes[0].overview_path;

          const mainRouteLine = new window.google.maps.Polyline({
            path: routePath,
            geodesic: true,
            strokeColor: '#EC4D4A',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            icons: [
              {
                icon: {
                  path: 'M 0,-1 0,1',
                  strokeOpacity: 1,
                  scale: 3
                },
                offset: '0',
                repeat: '20px'
              }
            ],
            map: googleMapRef.current,
            zIndex: 1
          });

          markersRef.current.push({ setMap: (map) => mainRouteLine.setMap(map) });
          console.log('✅ Red route polyline drawn successfully following roads!');
        } else {
          console.warn('❌ Directions API failed:', status, '- Drawing straight line fallback');
          // Fallback to straight line if API fails
          const mainRouteLine = new window.google.maps.Polyline({
            path: [pickupLocation, dropLocation],
            geodesic: true,
            strokeColor: '#EC4D4A',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: googleMapRef.current,
            zIndex: 1
          });
          markersRef.current.push({ setMap: (map) => mainRouteLine.setMap(map) });
        }
      });
    } else {
      console.warn('❌ Cannot draw polyline - missing coordinates:', {
        pickupLat,
        pickupLng,
        dropLat,
        dropLng
      });
    }

    // Draw active route based on driver location and order status using Directions API
    if (riderLat && riderLng && pickupLat && pickupLng && dropLat && dropLng) {
      let origin, destination;
      let routeColor = '#2196F3';
      let routeLabel = '';

      if (orderData?.status === 'Pending' || orderData?.bookingStatus === 'Pending' || orderData?.bookingStatus === 'pending') {
        // Driver going to pickup
        origin = { lat: parseFloat(riderLat), lng: parseFloat(riderLng) };
        destination = { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) };
        routeColor = '#FF9800'; // Orange for going to pickup
        routeLabel = 'Driver → Pickup';
      } else if (
        orderData?.status === 'In Progress' ||
        orderData?.bookingStatus === 'In Progress' ||
        orderData?.bookingStatus === 'in_progress' ||
        orderData?.bookingStatus === 'accepted'
      ) {
        // Driver going to drop (with package)
        origin = { lat: parseFloat(riderLat), lng: parseFloat(riderLng) };
        destination = { lat: parseFloat(dropLat), lng: parseFloat(dropLng) };
        routeColor = '#4CAF50'; // Green for delivering
        routeLabel = 'Driver → Drop';
      }

      if (origin && destination) {
        const directionsService = new window.google.maps.DirectionsService();

        const request = {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING
        };

        console.log(`🛣️ Requesting ${routeLabel} route from Directions API`);

        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const routePath = result.routes[0].overview_path;

            const activeRouteLine = new window.google.maps.Polyline({
              path: routePath,
              geodesic: true,
              strokeColor: routeColor,
              strokeOpacity: 0.9,
              strokeWeight: 5,
              map: googleMapRef.current,
              zIndex: 10
            });

            markersRef.current.push({ setMap: (map) => activeRouteLine.setMap(map) });
            console.log(`✅ ${routeLabel} route drawn successfully following roads!`);
          } else {
            console.warn(`❌ Directions API failed for ${routeLabel}:`, status, '- Drawing straight line fallback');
            // Fallback to straight line
            const activeRouteLine = new window.google.maps.Polyline({
              path: [origin, destination],
              geodesic: true,
              strokeColor: routeColor,
              strokeOpacity: 0.9,
              strokeWeight: 5,
              map: googleMapRef.current,
              zIndex: 10
            });
            markersRef.current.push({ setMap: (map) => activeRouteLine.setMap(map) });
          }
        });
      }
    }

    // Fit map bounds
    if (markersRef.current.length > 0) {
      googleMapRef.current.fitBounds(bounds);
      const listener = window.google.maps.event.addListener(googleMapRef.current, 'idle', () => {
        if (googleMapRef.current.getZoom() > 15) googleMapRef.current.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    }
  };

  const getStatusColor = () => {
    const status = orderData?.status || orderData?.bookingStatus;
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FF9800';
      case 'in progress':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusLabel = () => {
    const status = orderData?.status || orderData?.bookingStatus;
    switch (status?.toLowerCase()) {
      case 'pending':
        return '🚗 Driver going to pickup';
      case 'in progress':
        return '📦 Driver en route to drop';
      case 'completed':
        return '✅ Order completed';
      case 'cancelled':
        return '❌ Order cancelled';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '12px 12px 0 0',
          bgcolor: '#EC4D4A'
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
            🗺️ Live Order Tracking
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Order #{orderData?.bookingId || orderData?._id?.slice(-6) || 'N/A'} • Updates every 10 seconds
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Paper>

      {/* Status Card */}
      <Card sx={{ mx: 2, mt: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: getStatusColor(), width: 56, height: 56 }}>
              <CarIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {getStatusLabel()}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`Status: ${orderData?.status || orderData?.bookingStatus || 'N/A'}`}
                  size="small"
                  sx={{ bgcolor: getStatusColor(), color: 'white' }}
                />
                {riderData && (
                  <>
                    <Chip icon={<PhoneIcon />} label={riderData.phone || 'N/A'} size="small" variant="outlined" />
                    <Chip icon={<CarIcon />} label={riderData.vehicleType || 'N/A'} size="small" variant="outlined" />
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Map */}
      <Box sx={{ flex: 1, position: 'relative', m: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600}>
              Error: {error}
            </Typography>
            <Typography variant="caption" component="div" sx={{ mt: 1 }}>
              Debug Info:
              <br />- Order ID: {orderData?._id || orderData?.id || 'N/A'}
              <br />- Rider ID (from _raw.riderId): {JSON.stringify(orderData?._raw?.riderId) || 'Not found'}
              <br />- Rider ID (direct): {JSON.stringify(orderData?.riderId) || 'Not found'}
              <br />- Check browser console for detailed logs
            </Typography>
          </Alert>
        )}

        {loading && !googleMapRef.current && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading map and rider location...
            </Typography>
          </Box>
        )}

        <Box
          ref={mapRef}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3
          }}
        />

        {/* Legend */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
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
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#4CAF50', border: '2px solid white' }} />
            <Typography variant="caption" fontWeight={500}>
              Driver
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '12px solid #2196F3'
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
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderLiveTracking;
