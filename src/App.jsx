import { useState } from "react";
import axios from "axios";

function App() {
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
    }
    finally {
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
      console.log(response.data);
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

  if (isFetching) return <div>Loading User maps. If this takes a long time the user probably does not have a map saved, I will add error handling later.</div>
  return (
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
          <option value="NA">NA: http://3.145.15.34</option>
          <option value="EU">EU: http://18.199.164.171</option>
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
        <input type="text" value={mapName} readOnly />
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
          <option value="NA">NA: http://3.145.15.34</option>
          <option value="EU">EU: http://18.199.164.171</option>
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
  );
}

export default App;
