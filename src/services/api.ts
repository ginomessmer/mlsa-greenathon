import axios from 'axios';

const endpoint = 'https://mlsa-greenathon.azurewebsites.net/api';
const code = 'fmptSsPpFH3QVLzvTYDF/Vms1qVkVjbxs36DUL3rAicrd1Neu3LKBQ==';
const requiredFields = ['name', 'industry', 'missionStatement', 'addressLine',
  'town', 'zipCode', 'countryIsoCode', 'logo'];

export interface Business {
  name: string;
  longitude: number;
  latitude: number;
}

export interface CreateBusiness {
  name: string;
  industry: string;
  missionStatement: string;
  addressLine: string;
  town: string;
  zipCode: string;
  countryIsoCode: string;
  logo: Blob;
}

export const queryBusiness = (params?: any) =>
  axios.get(endpoint + '/QueryBusinesses', { params });

export const submitBusiness = (business: CreateBusiness) => {
  let data = new FormData();
  
  requiredFields.forEach(x => data.append(x, (business as any)[x]));

  return axios.post(endpoint + '/SubmitBusiness?code=' + code,
    data);
};