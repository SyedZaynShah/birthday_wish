=================================================================
      CALLING ARCHITECTURE - AUDIT REPORT (CONDENSED)
=================================================================
Date: 2026-06-28 | System: modchat_updated | Scope: 1-to-1 Audio/Video
Status: NO MODIFICATIONS MADE (Read-Only Analysis)

=================================================================
1. COMPONENTS
=================================================================

SERVICES
  • CallService          – Lifecycle, Firestore signaling, timeouts, logging
  • CallController       – WebRTC peer connection, media streams, reconnection
  • CallPeerConnection   – Reusable 1-to-1 peer connection (extracted from above)
  • FirestoreService     – Firestore access (calls, callLogs, users, dmChats, groups)

SCREENS
  • IncomingCallScreen   – Accept/Decline; routes to CallScreen or VideoCallScreen
  • CallScreen           – Voice UI (mute, speaker, duration)
  • VideoCallScreen      – Video UI (camera on/off/switch, mute, speaker)

WIDGETS / MODELS
  • IncomingCallListener – Global Firestore stream; shows IncomingCallScreen
  • CallState            – Enum: calling|ringing|accepted|declined|missed|cancelled|ended|failed
  • CallLog              – Permanent call history record

=================================================================
2. FIRESTORE COLLECTIONS
=================================================================

calls/          Active signaling. Key fields: callerId, receiverId, type, status,
                offer, answer, iceCandidates. Deleted/kept after call ends.

callLogs/       Permanent history. Key fields: callId, type, durationSeconds,
                status (missed|completed|declined|cancelled|failed).

dmChats/{id}/messages/  Call messages. type='system', messageType='call',
                        meta: { callType, callStatus, callDuration, callId, callLogId }

users/          Checked for online status before initiating a call.

=================================================================
3. CALL ENTRY POINTS
=================================================================

startVoiceCall() / startVideoCall()  →  _startCall():
  1. Verify neither party has an active call
  2. Create calls/ document (status='calling')
  3. After 500ms → status='ringing'
  4. Start 30-second timeout timer
  5. Return callId → navigate to CallScreen / VideoCallScreen

=================================================================
4. INCOMING CALL FLOW
=================================================================

IncomingCallListener streams:
  calls/.where(receiverId==me).where(status=='ringing')

  On detection → IncomingCallScreen:
    ACCEPT  → acceptCall() → status='accepted' → CallScreen/VideoCallScreen → WebRTC init
    DECLINE → declineCall() → status='declined' → save log → caller sees "Call Declined"

  30-second timeout:
    Still ringing → status='missed' → save log → caller sees "Not Answered"

=================================================================
5. WEBRTC SIGNALING FLOW
=================================================================

CALLER:   getUserMedia → createPeerConnection → addTrack →
          createOffer → setLocalDescription → write offer to Firestore →
          wait for answer → setRemoteDescription → ICE exchange

RECEIVER: getUserMedia → createPeerConnection → addTrack →
          read offer → setRemoteDescription → createAnswer →
          setLocalDescription → write answer to Firestore → ICE exchange

CONNECTED: onTrack fires → remote stream attached → media flows bidirectionally

ICE exchange: onIceCandidate → write to Firestore iceCandidates array
              Other side reads → addCandidate() (buffered until remoteDescription set)

STUN server: stun:stun.l.google.com:19302

=================================================================
6. AUDIO / VIDEO ROUTING
=================================================================

Voice calls:  getStereoMedia({audio:true})  → earpiece by default
Video calls:  getStereoMedia({audio+video}) → speaker by default
Toggle:       Helper.setSpeakerphoneOn(bool)
Mute:         audioTrack.enabled = false/true
Bluetooth:    NOT explicitly handled (relies on OS default)

Local video:  localRenderer.srcObject = _localStream  (set once)
Remote video: remoteRenderer.srcObject = _remoteStream (set on each onTrack — see §7)

=================================================================
7. ECHO / BUG RISKS
=================================================================

HIGH   Remote renderer reassignment
       onTrack fires once per track (audio, then video).
       Each firing overwrites remoteRenderer.srcObject.
       If stream objects differ across firings → multiple streams play → echo.
       Fix: guard with `if (remoteRenderer.srcObject == null)`

MEDIUM Callback duplication
       onRemoteStream() fires on every onTrack event.
       UI may attach stream multiple times.
       Fix: deduplicate by stream ID before invoking callback.

LOW    Audio routing race
       setSpeakerphoneOn() called at init; user may have already toggled speaker.

LOW    Physical feedback loop
       High speaker volume + sensitive mic → not a code issue.

=================================================================
8. DISPOSAL & LISTENER AUDIT
=================================================================

All components clean — no leaks detected.

CallController.dispose():
  cancel Firestore listeners → stop/dispose streams → dispose renderers →
  close & dispose RTCPeerConnection → set _isDisposed=true

CallScreen / VideoCallScreen dispose():
  cancel Firestore subscription → cancel timers → call controller.dispose()

CallService.dispose():
  cancel all timeout timers and monitoring listeners

FIRESTORE LISTENERS (all accounted for):
  CallService   – timeout monitor (stored in map, cancelled in _cancelCallTimeout)
  CallService   – listenToCall() stream (caller cancels subscription)
  CallService   – listenToIncomingCalls() (managed by Riverpod)
  CallController– _callDocListener, _iceCandidatesListener (cancelled in dispose)
  CallPeerConnection – same two listeners (cancelled in dispose)

TIMERS (all accounted for):
  _callTimeouts (30s)       – CallService, map-managed
  _reconnectionTimer (15s)  – CallController
  _durationTimer (1s)       – CallScreen / VideoCallScreen
  _dotTimer (500ms)         – CallScreen ringing animation

=================================================================
9. GROUP CALL FILES (DO NOT MODIFY)
=================================================================

group_call_service.dart       – Phase 1 room/participant management (no WebRTC)
group_call_room_service.dart  – Coordinates multiple 1-to-1 calls
call_peer_connection.dart     – Shared peer connection component
group_audio_call_screen.dart  – Phase 1 UI
incoming_group_call_screen.dart
incoming_group_call_listener.dart
group_call_providers.dart

=================================================================
