import { ControlBar, GridLayout, LiveKitRoom, ParticipantTile, useTracks } from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { useUserContext } from '../context/UserContext';

const serverUrl = 'wss://discord-clone-6tnm5nqn.livekit.cloud';

export default function App() {
  const { token, setConnectedToVoice, setHandleDisconnect } = useUserContext();
  const handleConnected = () => { setConnectedToVoice(true); };
  const handleDisconnected = () => { setConnectedToVoice(false); setHandleDisconnect(true); };

  return (
    <LiveKitRoom video={true} audio={true} connect={true} token={token} serverUrl={serverUrl} data-lk-theme="default" style={{ height: '100vh' }} onConnected={handleConnected} onDisconnected={handleDisconnected}>
      <MyVideoConference />
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }, { source: Track.Source.ScreenShare, withPlaceholder: false }], { onlySubscribed: false });
  return (<GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}><ParticipantTile /></GridLayout>);
}
