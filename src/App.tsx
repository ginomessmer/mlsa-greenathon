import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { Sidebar, SearchBox, SubmitBusinessForm, ModalCloseButton } from './components';
import { Business, queryBusiness, submitBusiness } from './services/api';
import { BusinessMarker } from './data';


import { AuthenticationType, data, ControlOptions } from 'azure-maps-control';
import {
  AzureMap, AzureMapFeature, AzureMapsProvider,
  AzureMapDataSourceProvider, AzureMapLayerProvider, IAzureMapLayerType,
  IAzureMapControls, IAzureMapOptions
} from 'react-azure-maps';

import './App.scss';

const azureMapOptions: IAzureMapOptions = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: 'Ea_uzBbOhHmVPM5UjV-vEoW7wRw0bO-RTc7bo7AhtIw'
  },
}

const azureMapControls: IAzureMapControls[] = [
  {
    controlName: 'StyleControl',
    controlOptions: { mapStyles: 'all' },
    options: { position: 'top-right' } as ControlOptions
  }
]

const App = () => {
  // Modal
  const [submitBusinessModelIsOpen, setSubmitBusinessModalOpen] = useState(false);
  const closeModal = () => setSubmitBusinessModalOpen(false);
  
  // Map configuration
  const [markersLayer] = useState<IAzureMapLayerType>('SymbolLayer');

  // Businesses
  const [businesses, setBusinesses] = useState<BusinessMarker[]>([]);

  useEffect(() => {
    queryBusiness()
      .then(x => {
        var collection = x.data.map((z: Business) => ({
          position: new data.Position(z.longitude, z.latitude)
        }))

        setBusinesses(collection);
      });
  }, []);

  const handleSubmitBusiness = (values: any) => {
    submitBusiness(values)
      .then(() => {
        alert('Thanks for submitting your business. Your business will be displayed on the map once it has been approved by the website owners.');
        closeModal();
      })
      .catch(err => alert(err));
  }

  return (
    <div className="App">
      <AzureMapsProvider>
        <div>
          <div className="map-container">
            <AzureMap options={azureMapOptions}
              controls={azureMapControls}>
              <AzureMapDataSourceProvider id={'markers AzureMapDataSourceProvider'} options={{ cluster: true, clusterRadius: 2 }}>
                <AzureMapLayerProvider
                  id={'markers AzureMapLayerProvider'}
                  type={markersLayer}/>

                {businesses.map(x => <AzureMapFeature id={'1'} type="Point" properties={{title: 'Pin'}} coordinate={x.position} />)}
              </AzureMapDataSourceProvider>
            </AzureMap>
          </div>
          <Sidebar />
          <SearchBox />

          <Modal className="modal overflow"
            isOpen={submitBusinessModelIsOpen}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}>
            <SubmitBusinessForm onSubmitForm={handleSubmitBusiness} />
            <ModalCloseButton onModalClose={closeModal} />
          </Modal>
        
          <div className="fab-overlay">
            <button className="fab" onClick={() => setSubmitBusinessModalOpen(true)}>Add a new business</button>
          </div>
        </div>
      </AzureMapsProvider>

    </div>
  );
}

export default App;
