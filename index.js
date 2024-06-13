class PeerWebRTC {
	constructor(initiator = false, stream, config = {}) {
		this.peer = new RTCPeerConnection(config)
		this.stream = stream
		this.initiator = initiator
		this.events = {
			onSignal: () => {
				console.warn(`onSignal called without a callback at ${new Date().toISOString()}`);
			},
			onConnect: () => {
			},
			onIceCandidate: () => {
			},
			onData: () => {
			},
			onStream: () => {
			},
		}

		this.peer.ontrack = async (e) => {
			if (e.streams.length > 0) {
				await this.events.onStream(e.streams[0])
			}
		}

		this.initialize()

		this.peer.onconnectionstatechange = (e) => {
			switch (this.peer.connectionState) {
				case 'connected':
					break;
				default:
					break;
			}
		}

		this.peer.onicecandidate = (e) => {
			if (e.candidate)
				this.events.onIceCandidate(e.candidate)
		}

		this.peer.ondatachannel = (e) => {
			const receivedDataChannel = e.channel;

			receivedDataChannel.onmessage = (event) => {
				this.events.onData(event.data)
			};
		}

	}

	async initialize() {
		this.stream?.getTracks().forEach(track => {
			this.peer.addTrack(track, this.stream)
		})


		this.datachannel = this.peer.createDataChannel('data')
		this.datachannel.onopen = async () => {
			await this.events.onConnect()
		}

		if (!this.initiator)
			return

		const offer = await this.peer.createOffer()
		this.peer.setLocalDescription(offer)
		await this.events.onSignal(offer)
	}

	async onSignal(callback) {
		this.events.onSignal = callback
	}

	async onIceCandidate(callback) {
		this.events.onIceCandidate = callback
	}

	async addIceCandidate(candidate) {
		this.peer.addIceCandidate(new RTCIceCandidate(candidate))
	}

	async onConnect(callback) {
		this.events.onConnect = callback
	}

	async onData(callback) {
		this.events.onData = callback
	}

	async onStream(callback) {
		this.events.onStream = callback
	}

	async signal(sdp) {
		await this.peer.setRemoteDescription(sdp)
		if (this.initiator)
			return
		const answer = await this.peer.createAnswer()
		this.peer.setLocalDescription(answer)
		await this.events.onSignal(answer)
	}

	async send(data) {
		this.datachannel.send(data)
	}
}

export default PeerWebRTC