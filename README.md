https://map-util.netlify.app/

Recreation of eedok's Map Util

# Instructions:

* Load the required map from an account from either NA, EU, or Xgen servers.
* Expand Map Data and scroll down through the values until you find "&ws"
* Right of "&ws" are weapon spawns. Each weapon has 4 values. First two are what I assume XY positions, 3rd is the value, 4th is the weapon spawn timer. If it says 20, it's 20 seconds.
* Change respawn timers by modifying value in Map Data.
* Through the same application authenticate your account from either the NA or EU server.
* Optionally change map name and slot number, save it.
* Login to Leo's EU Private Server and search up your XGen account you saved the map on.

Future: in-browser Map Editor and UI modernization

# FAQ:

1. What do I need this for?
     * There is no in-game option to modify respawn timers or tile collisions in the in-game map builder

2. Why recreate the map util, why can't I just use eedok's?
     * It did not have multi-server support and did not connect to our API
     * You now no longer need to create an account with the same login information as your original Xgen information as was required previously
     * The original map tool was written in Flash which is no longer supported.
     * We can make the modification process a lot simpler in a future update

3. How does it work?
     * It utilizes the same API as the original map util for the Xgen server, but this adds the NA and EU server by including our API.

4. I still don't get it!
     * You can ask someone in the server for help
