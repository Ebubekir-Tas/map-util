import { useState } from 'react';
import axios from 'axios';

function App() {
    const [userName, setUserName] = useState('');
    const [saveUserName, setSaveUserName] = useState('');
    const [password, setPassword] = useState('');
    const [mapSlotNum, setMapSlotNum] = useState(1);
    const [mapName, setMapName] = useState('');
    const [mapData, setMapData] = useState('');
    const [saveMapSlotNum, setSaveMapSlotNum] = useState(1);

    const handleLoad = async () => {
      try {
          const response = await axios.get('https://map-editor-mauve.vercel.app/loadMap', {
              params: {
                  uName: userName,
                  mapSlotNum
              }
          });
          setMapName(response.data.mapName);
          setMapData(response.data.mapData);
          setSaveMapSlotNum(mapSlotNum);
      } catch (error) {
          alert('Map Load Failed');
      }
  };

    const handleSave = async () => {
        try {
            const response = await axios.post('https://map-editor-mauve.vercel.app/saveMap', {
                uName: saveUserName,
                uPass: password,
                mapSlotNum: saveMapSlotNum,
                mapName,
                mapData
            });
            console.log(response.data);
            if (response.data) {
                alert("successfully saved map to user: " + saveUserName)
            }
        } catch (error) {
            alert('Map Save Failed');
        }
    };

    return (
        <div>
            <div>
                <p>Load from SAPS account:</p>
                <label>User Name: </label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div>
                <label>Map Slot: </label>
                <input type="number" value={mapSlotNum} onChange={(e) => setMapSlotNum(Number(e.target.value))} min="1" max="5" />
            </div>
            <div>
                <button onClick={handleLoad}>Load</button>
            </div>
            <p>
                save to SAPS account:
            </p>
            <div>
                <label>User Name: </label>
                <input type="text" value={saveUserName} onChange={(e) => setSaveUserName(e.target.value)} />
            </div>
            <div>
                <label>Password: </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label>Map Name: </label>
                <input type="text" value={mapName} readOnly />
            </div>
            <div>
                <label>Save Map Slot: </label>
                <input type="number" value={saveMapSlotNum} onChange={(e) => setSaveMapSlotNum(Number(e.target.value))} min="1" max="5" />
            </div>
            <div>
                <label>Map Data: </label>
                <textarea value={mapData} onChange={(e) => setMapData(e.target.value)} />
            </div>
            <div>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}

export default App;
