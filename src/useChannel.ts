import { Channel, PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";

import invariant from "invariant";
import { usePusher } from "./usePusher";

/**
 * Subscribe to a channel
 *
 * @param channelName The name of the channel you want to subscribe to.
 * @typeparam Type of channel you're subscribing to. Can be one of `Channel` or `PresenceChannel` from `pusher-js`.
 * @returns Instance of the channel you just subscribed to.
 *
 * @example
 * ```javascript
 * const channel = useChannel("my-channel")
 * channel.bind('some-event', () => {})
 * ```
 */

export function useChannel<T extends Channel & PresenceChannel>(
  channelName: string
) {
  // errors for missing arguments
  invariant(channelName, NO_CHANNEL_NAME_ERROR);
  const { client } = usePusher();
  const [channel, setChannel] = useState<T | undefined>();
  useEffect(() => {
    if (!client) return;
    const pusherChannel = client?.subscribe(channelName);

    setChannel(pusherChannel as T);
    return () => client?.unsubscribe(channelName);
  }, [channelName, client]);
  return channel;
}

export const NO_CHANNEL_NAME_ERROR =
  "channelName required to subscribe to a channel";
