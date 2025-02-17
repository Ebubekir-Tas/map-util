import { useState, useMemo } from "react";
import axios from "axios";

const UsernameUtil = () => {
	const [server, setServer] = useState("NA");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [newUsername, setNewUsername] = useState("");

  const handleSubmit = () => {
    if (newUsername.length < 3) {
      alert("new username must be at least 3 chars");
      return;
    }
  
    const url =
      server === "NA"
        ? "http://98.84.151.65/api.php?method=xgen.users.changeName"
        : "http://15.237.196.49/api.php?method=xgen.users.changeName";
  
    const params = new URLSearchParams({
      username: username,
      password: password,
      new_username: newUsername
    });
  
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.text(); // Or response.json() depending on what the server returns
      })
      .then((data) => {
        console.log("Response data:", data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };
  
	return (
		<div>
			<p style={{ fontWeight: "600" }}>select server</p>
			<p>current: {server}</p>
			<button
				onClick={() => {
					setServer("NA");
				}}
			>
				NA
			</button>
			<button
				onClick={() => {
					setServer("EU");
				}}
			>
				EU
			</button>
			<div>
				<label>User Name: </label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div>
				<label>Password: </label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<div>
				<label>Change User Name To: </label>
				<input
					type="text"
					value={newUsername}
					onChange={(e) => setNewUsername(e.target.value)}
				/>
			</div>

			<button onClick={handleSubmit}>submit</button>
		</div>
	);
};

const MapUtil = () => {
	const [userName, setUserName] = useState("");
	const [saveUserName, setSaveUserName] = useState("");
	const [password, setPassword] = useState("");
	const [mapSlotNum, setMapSlotNum] = useState(1);
	const [mapName, setMapName] = useState("");
	const [mapData, setMapData] = useState("");
	const [saveMapSlotNum, setSaveMapSlotNum] = useState(1);
	const [loadServer, setLoadServer] = useState("NA");
	const [saveServer, setSaveServer] = useState("NA");

	const [isLoadDisabled, setIsLoadDisabled] = useState(false);
	const [isSaveDisabled, setIsSaveDisabled] = useState(false);

	const [isFetching, setIsFetching] = useState(false);

	const weaponsData = useMemo(() => {
		const wsMatch = mapData.match(/&ws=\s*([\s\S]+?)\s*&rt=/);
		if (!wsMatch) return [];

		const wsSection = wsMatch[1];

		const wsArray = [];
		for (let i = 0; i < wsSection.length; i += 4) {
			wsArray.push(wsSection.substr(i, 4));
		}

		const weapons = [];
		for (let i = 0; i < wsArray.length; i += 5) {
			const weapon = wsArray.slice(i, i + 5);
			weapons.push(weapon);
		}

		return weapons;
	}, [mapData]);

	const handleMapDataChange = (index, newValue) => {
		const value = Math.max(0, Math.min(30, parseInt(newValue, 10)));
		const formattedValue = String(value).padEnd(4, " ");

		const updatedWeapons = [...weaponsData];
		updatedWeapons[index][4] = formattedValue;

		const updatedWsArray = updatedWeapons.flat();

		const newMapData = mapData.replace(
			/(&ws=)\s*([\s\S]+?)\s*(&rt=)/,
			(_, prefix, wsSection, suffix) =>
				`${prefix} ${updatedWsArray.join("")}${suffix}`
		);

		setMapData(newMapData);
	};

	const handleLoad = async () => {
		try {
			setIsFetching(true);
			const response = await axios.get(
				"https://map-editor-mauve.vercel.app/loadMap",
				{
					params: {
						uName: userName,
						mapSlotNum,
						server: loadServer,
					},
				}
			);
			setMapName(response.data.mapName);
			setMapData(response.data.mapData);
			setSaveMapSlotNum(mapSlotNum);
		} catch (error) {
			alert("Map Load Failed");
		} finally {
			setIsFetching(false);
		}
	};

	const handleSave = async () => {
		try {
			const response = await axios.post(
				"https://map-editor-mauve.vercel.app/saveMap",
				{
					uName: saveUserName,
					uPass: password,
					mapSlotNum: saveMapSlotNum,
					mapName,
					mapData,
					server: saveServer,
				}
			);
			if (response.data) {
				alert(
					"successfully saved map to user: " +
						saveUserName +
						" in server " +
						saveServer
				);
			}
		} catch (error) {
			alert("Map Save Failed");
		}
	};

	const handleLoadClick = () => {
		if (!isLoadDisabled) {
			handleLoad();
			setIsLoadDisabled(true);
			setTimeout(() => setIsLoadDisabled(false), 2000);
		}
	};

	const handleSaveClick = () => {
		if (!isSaveDisabled) {
			handleSave();
			setIsSaveDisabled(true);
			setTimeout(() => setIsSaveDisabled(false), 2000);
		}
	};

	if (isFetching)
		return (
			<div>
				Loading User maps. If this takes a long time the user probably does not
				have a map saved, I will add error handling later.
			</div>
		);
	return (
		<div style={{ display: "flex", gap: "32px" }}>
			<div>
				<div>
					<h4>Load from:</h4>
					<label>User Name: </label>
					<input
						type="text"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
					/>
				</div>
				<div>
					<label>Map Slot: </label>
					<input
						type="number"
						value={mapSlotNum}
						onChange={(e) => setMapSlotNum(Number(e.target.value))}
						min="1"
						max="5"
					/>
				</div>
				<div>
					<label>Server: </label>
					<select
						value={loadServer}
						onChange={(e) => setLoadServer(e.target.value)}
					>
						<option value="NA">NA: http://98.84.151.65</option>
						<option value="EU">EU: http://15.237.196.49</option>
						<option value="XGEN">XGENSTUDIOS</option>
					</select>
				</div>
				<div>
					<button onClick={handleLoadClick} disabled={isLoadDisabled}>
						Load
					</button>
				</div>
				<hr />
				<h4>Save to:</h4>
				<div>
					<label>User Name: </label>
					<input
						type="text"
						value={saveUserName}
						onChange={(e) => setSaveUserName(e.target.value)}
					/>
				</div>
				<div>
					<label>Password: </label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div>
					<label>Map Name: </label>
					<input
						type="text"
						value={mapName}
						onChange={(e) => setMapName(e.target.value)}
					/>
				</div>
				<div>
					<label>Save Map Slot: </label>
					<input
						type="number"
						value={saveMapSlotNum}
						onChange={(e) => setSaveMapSlotNum(Number(e.target.value))}
						min="1"
						max="5"
					/>
				</div>
				<div>
					<label>Save Server: </label>
					<select
						value={saveServer}
						onChange={(e) => setSaveServer(e.target.value)}
					>
						<option value="NA">NA: http://98.84.151.65</option>
						<option value="EU">EU: http://15.237.196.49</option>
					</select>
				</div>
				<div>
					<label>Map Data: </label>
					<textarea
						placeholder="drag to expand"
						value={mapData}
						onChange={(e) => setMapData(e.target.value)}
					/>
				</div>
				<div>
					<button onClick={handleSaveClick} disabled={isSaveDisabled}>
						Save
					</button>
				</div>
			</div>

			<div hidden={weaponsData.length === 0}>
				respawn timers 0 - 30 sec:
				{weaponsData.map((data, i) => (
					<div key={Math.random()}>
						weapon {i + 1}:{" "}
						<input
							placeholder={`weapon ${i + 1}`}
							defaultValue={data[4].trim()}
							type="number"
							min={0}
							max={20}
							onChange={(e) => {
								const value = parseInt(e.target.value, 10);
								if (value >= 0 && value <= 30 && e.target.value !== "") {
									handleMapDataChange(i, value);
								}
							}}
						/>
					</div>
				))}
			</div>
			<div></div>
		</div>
	);
};

function App() {
	const [util, setUtil] = useState("map");

	return (
		<div>
			<p>select util</p>
			<button
				onClick={() => {
					setUtil("map");
				}}
			>
				map
			</button>
			<button
				onClick={() => {
					setUtil("username");
				}}
			>
				change username
			</button>

			<div>
				{util === "map" ? <MapUtil /> : <></>}
				{util === "username" ? <UsernameUtil /> : <></>}
			</div>
		</div>
	);
}

export default App;
