# peer-webrtc

[![npm version](https://badge.fury.io/js/peer-webrtc.svg)](https://badge.fury.io/js/peer-webrtc)
[![GitHub license](https://img.shields.io/github/license/Abhay-Vachhani/peer-webrtc.svg)](https://github.com/Abhay-Vachhani/peer-webrtc/blob/master/License)

`peer-webrtc` simplifies the implementation of WebRTC connections by providing a straightforward API for establishing peer-to-peer communication. It's ideal for developers looking to integrate real-time audio, video, and data channels into their applications with minimal setup.

## Features

- **Easy Setup**: Simplifies the creation and management of WebRTC connections.
- **Real-Time Communication**: Supports both audio/video streaming and data channels.
- **Flexible API**: Offers customizable event handlers for handling various WebRTC events.

## Installation

Install `peer-webrtc` using npm:

```bash
npm install peer-webrtc
```

Install `peer-webrtc` using yarn:

```bash
yarn add peer-webrtc
```

## Basic Usage

### Creating a Peer Connection

To start using `peer-webrtc`, create a new instance of the `PeerWebRTC` class. You need to specify whether the peer is an initiator and optionally provide a media stream and configuration for the RTCPeerConnection.

```javascript
import PeerWebRTC from 'peer-webrtc';

// Create a new PeerWebRTC instance
const peer = new PeerWebRTC(true, mediaStream, rtcConfig);
```

- `initiator`: A boolean indicating if this peer initiates the connection.
- `mediaStream`: An optional `MediaStream` object for audio/video streams.
- `rtcConfig`: Optional configuration for the RTCPeerConnection.

### Setting Up Event Handlers

You can define callbacks for various events such as receiving a signal, connection state changes, incoming data, and new streams.

```javascript
peer.onSignal(async (sdp) => {
  // Send SDP to the remote peer
  sendSignalToRemotePeer(sdp);
});

peer.onConnect(() => {
  console.log('Connection established!');
});

peer.onDisconnect(() => {
  console.log('Connection lost.');
});

peer.onData((data) => {
  console.log('Received data:', data);
});

peer.onStream((stream) => {
  // Attach the stream to a video element or handle it as needed
  const videoElement = document.getElementById('remoteVideo');
  videoElement.srcObject = stream;
});
```

### Handling Incoming Signals

When you receive a signal from the remote peer, use the `signal` method to process it. This will handle SDP offers and answers automatically.

```javascript
async function receiveRemoteSignal(sdp) {
  await peer.signal(sdp);
}
```

### Adding ICE Candidates

To manage ICE candidates, provide a callback to handle them and add remote candidates as they arrive.

```javascript
peer.onIceCandidate((candidate) => {
  // Send the ICE candidate to the remote peer
  sendCandidateToRemotePeer(candidate);
});

async function addRemoteIceCandidate(candidate) {
  await peer.addIceCandidate(candidate);
}
```

### Sending Data

You can send data over the established data channel using the `send` method.

```javascript
peer.send('Hello, peer!');
```

### Disconnecting

To gracefully close the connection, use the `disconnect` method.

```javascript
peer.disconnect();
```

## Advanced Usage

### Custom RTCPeerConnection Configuration

You can pass a custom configuration object to the `RTCPeerConnection` constructor via the `rtcConfig` parameter. This is useful for specifying ICE servers or other advanced settings.

```javascript
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com', username: 'user', credential: 'pass' }
  ]
};

const peer = new PeerWebRTC(true, mediaStream, rtcConfig);
```

### Working with Media Streams

To send audio or video, pass a `MediaStream` object when creating the `PeerWebRTC` instance. You can obtain a media stream using the `getUserMedia` API.

```javascript
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    const peer = new PeerWebRTC(true, stream);
  })
  .catch((error) => {
    console.error('Error accessing media devices.', error);
  });
```

## API Reference

### Constructor

```javascript
new PeerWebRTC(initiator, stream, config);
```

- **initiator**: `Boolean` - Indicates if the peer is the connection initiator.
- **stream**: `MediaStream` - Optional media stream for audio/video.
- **config**: `Object` - Optional RTCPeerConnection configuration.

### Methods

- **onSignal(callback)**: Register a callback to handle signaling data.
- **onIceCandidate(callback)**: Register a callback to handle ICE candidates.
- **onConnect(callback)**: Register a callback to handle connection establishment.
- **onDisconnect(callback)**: Register a callback to handle connection closure.
- **onData(callback)**: Register a callback to handle received data.
- **onStream(callback)**: Register a callback to handle received media streams.
- **signal(sdp)**: Process an incoming SDP signal.
- **addIceCandidate(candidate)**: Add a remote ICE candidate.
- **send(data)**: Send data over the data channel.
- **disconnect()**: Close the connection.

## License

`peer-webrtc` is [MIT licensed](https://github.com/Abhay-Vachhani/peer-webrtc/blob/master/License).