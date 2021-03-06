var PeerManager = (function () {

  var localId,
  config = {
    peerConnectionConfig: {
      iceServers: [
          { "url": "stun:23.21.150.121" },
          { "url": "stun:stun.l.google.com:19302" }
      ]
    },
    peerConnectionConstraints: {
      optional: [
          { "DtlsSrtpKeyAgreement": true }
      ]
    }
  },
  peerDatabase = {},
  localStream,
  remoteVideoContainer = document.getElementById('remoteVideosContainer'),
  socket = io("http://localhost:3000");

  socket.on('message', handleMessage);
  socket.on('id', function (id) {
    localId = id;
  });

  function addPeer(remoteId) {
    var peer = new Peer(config.peerConnectionConfig, config.peerConnectionConstraints);
    peer.pc.onicecandidate = function (event) {
      if (event.candidate) {
        send('candidate', remoteId, {
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        });
      }
    };
    peer.pc.onaddstream = function (event) {
      attachMediaStream(peer.remoteVideoEl, event.stream);
      // remoteVideosContainer.appendChild(peer.remoteVideoEl);
    };
    peer.pc.onremovestream = function (event) {
      peer.remoteVideoEl.src = '';
      // remoteVideosContainer.removeChild(peer.remoteVideoEl);
    };
    peer.pc.oniceconnectionstatechange = function (event) {
      switch (
      (event.srcElement // Chrome
        || event.target) // Firefox
        .iceConnectionState) {
        case 'disconnected':
        // if (remoteVideosContainer != undefined){
          // remoteVideosContainer.removeChild(peer.remoteVideoEl);
        // }
          
          break;
      }
    };
    peerDatabase[remoteId] = peer;

    return peer;
  }
  function answer(remoteId) {
    var pc = peerDatabase[remoteId].pc;
    pc.createAnswer(
      function (sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        send('answer', remoteId, sessionDescription);
      },
      error
    );
  }
  function offer(remoteId) {
    var pc = peerDatabase[remoteId].pc;
    pc.createOffer(
      function (sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        send('offer', remoteId, sessionDescription);
      },
      error
    );
  }
  function handleMessage(message) {

    var type = message.type,
      from = message.from,
      pc = (peerDatabase[from] || addPeer(from)).pc;
    switch (type) {
      case 'init':
        toggleLocalStream(pc);
        offer(from);
        break;
      case 'offer':
        pc.setRemoteDescription(new RTCSessionDescription(message.payload), function () { }, error);
        answer(from);
        break;
      case 'answer':
        pc.setRemoteDescription(new RTCSessionDescription(message.payload), function () { }, error);
        break;
      case 'candidate':
        if (pc.remoteDescription) {
          pc.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: message.payload.label,
            sdpMid: message.payload.id,
            candidate: message.payload.candidate
          }), function () { }, error);
        }
        break;
    }
  }
  function send(type, to, payload) {
    socket.emit('message', {
      to: to,
      type: type,
      payload: payload
    });
  }
  function toggleLocalStream(pc) {
    if (localStream) {
      console.log(localStream);
      (!!pc.getLocalStreams().length) ? pc.removeStream(localStream) : pc.addStream(localStream);
    }
  }
  function error(err) {
    console.log(err);
  }

  return {
    getSocket: function () {
      return socket;
    },
    getId: function () {
      return localId;
    },
    setLocalStream: function (stream) {
      // if local cam has been stopped, remove it from all outgoing streams.
      if (!stream) {
        for (id in peerDatabase) {
          pc = peerDatabase[id].pc;
          console.log(pc);
          if (!!pc.getLocalStreams().length) {
            pc.removeStream(localStream);
            offer(id);
          }
        }
      }
      localStream = stream;
    },
    toggleLocalStream: function (remoteId) {
      peer = peerDatabase[remoteId] || addPeer(remoteId);
      toggleLocalStream(peer.pc);
    },
    peerInit: function (remoteId) {
      peer = peerDatabase[remoteId] || addPeer(remoteId);
      send('init', remoteId, null);
    },
    peerRenegociate: function (remoteId) {
      offer(remoteId);
    },
    send: function (type, payload) {
      socket.emit(type, payload);
    }
  };
});
var Peer = function (pcConfig, pcConstraints) {
  this.pc = new RTCPeerConnection(pcConfig, pcConstraints);
  this.remoteVideoEl = window.document.getElementById("receiveVideo");
}