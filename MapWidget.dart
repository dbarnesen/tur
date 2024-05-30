import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart' as latlng2;
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:flutter_compass/flutter_compass.dart';
import 'package:geolocator/geolocator.dart';

class MapWidget extends StatefulWidget {
  const MapWidget({
    super.key,
    this.width,
    this.height,
  });

  final double? width;
  final double? height;

  @override
  _MapWidgetState createState() => _MapWidgetState();
}

class _MapWidgetState extends State<MapWidget> {
  final MapController _mapController = MapController();
  late final Stream<LocationMarkerPosition?> _positionStream;
  late final Stream<LocationMarkerHeading?> _headingStream;

  @override
  void initState() {
    super.initState();
    _positionStream = Geolocator.getPositionStream().map((position) {
      return LocationMarkerPosition(
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
      );
    }).asBroadcastStream();

    _headingStream = FlutterCompass.events!.map((event) {
      if (event.heading != null) {
        return LocationMarkerHeading(
          heading: event.heading!,
          accuracy: event.accuracy ?? 0,
        );
      }
      return LocationMarkerHeading(
        heading: 0,
        accuracy: 0,
      ); // Made default value to avoid getting null problem
    }).asBroadcastStream();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: widget.width,
      height: widget.height,
      child: FlutterMap(
        mapController: _mapController,
        options: MapOptions(
          center: latlng2.LatLng(0, 0),
          zoom: 10,
        ),
        children: [
          TileLayer(
            urlTemplate:
                "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
            additionalOptions: {
              'accessToken':
                  'MYKEY',
              'id': 'MYSTYLE',
            },
          ),
          CurrentLocationLayer(
            style: LocationMarkerStyle(
              marker: DefaultLocationMarker(
                color: Colors.blue,
                child: Icon(
                  Icons.navigation,
                  color: Colors.white,
                ),
              ),
              markerSize: const Size(30, 30),
              markerDirection: MarkerDirection.heading,
              accuracyCircleColor: Colors.blue.withOpacity(0.1),
              headingSectorColor: Colors.blue.withOpacity(0.5),
              headingSectorRadius: 50,
            ),
            positionStream: _positionStream,
            headingStream: _headingStream,
            alignPositionOnUpdate: AlignOnUpdate.always,
            alignDirectionOnUpdate: AlignOnUpdate.always,
          ),
        ],
      ),
    );
  }
}
