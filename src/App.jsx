
import {AzureMap, AzureMapsProvider, IAzureMapOptions} from 'react-azure-maps'
import {AuthenticationType} from 'azure-maps-control'
import './App.scss';

const azureMapOptions = {
  authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: 'Ea_uzBbOhHmVPM5UjV-vEoW7wRw0bO-RTc7bo7AhtIw'
  },
}

const App = () => {
  return (
    <div className="App">
      <AzureMapsProvider>
        <div>
          <div className="map-container">
            <AzureMap options={azureMapOptions} />
          </div>

          <div className="sidebar open">
            <div className="heading">
              <span className="label">Sort and filter</span>
            </div>

            <div>
              <div className="input">
                <label htmlFor="sortBy" className="label">Sort by</label>
                <select name="sortBy" id="sortBy"></select>
              </div>
              <div className="input">
                <label htmlFor="distance" className="label">Distance</label>
                <input id="distance" type="text"/>
              </div>
              <div className="input">
                <label htmlFor="sustainability" className="label">Scale of sustainability</label>
                <input id="sustainability" type="text"/>
              </div>
              <div className="input">
                <label htmlFor="industry" className="label">Industry</label>
                <input id="industry" type="text"/>
              </div>
              <div className="input">
                <label htmlFor="type" className="label">Type</label>
                <div className="button-group">
                  <button className="active">Non-Profit</button>
                  <button>Profit</button>
                </div>
              </div>
            </div>
          </div>

          <div className="search-box">
            <input type="text" name="searchBox" id="searchBox" placeholder="Search a business..."/>
          </div>
        
          <div className="fab-overlay">
            <button className="fab">Add a new business</button>
          </div>
        </div>
      </AzureMapsProvider>

    </div>
  );
}

export default App;