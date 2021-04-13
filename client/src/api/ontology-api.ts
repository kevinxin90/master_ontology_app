import { apiEndpoint } from '../config'
import { Ontology } from '../types/Ontology';
import Axios from 'axios'
import { getIDToken } from '../auth/cognito'


export async function getOntologies(): Promise<Ontology[]> {
  console.log(`Fetching ontologies from ${apiEndpoint}/ontologies`)
  const idToken = await getIDToken();
  const response = await Axios.get(`${apiEndpoint}/ontologies`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': idToken
    },
    timeout: 5000
  })
  console.log('Ontologies:', response.data)
  return response.data.items
}

export async function getOntology(id: string): Promise<Ontology[]> {
  console.log(`Fetching ontology from ${apiEndpoint}/ontology`)
  const idToken = await getIDToken();
  const response = await Axios.get(`${apiEndpoint}/ontology/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': idToken
    },
    timeout: 5000
  })
  console.log('ontology:', response.data)
  return response.data.items
}


export async function deleteOntology(
  id: string
): Promise<void> {
  console.log("delete ontology")
  const idToken = await getIDToken();
  await Axios.delete(`${apiEndpoint}/ontology/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': idToken
    },
    timeout: 6000
  })
  alert(`Ontology id ${id} is succesfully deleted!`)

}

export async function createOntology(
  data: any
): Promise<void> {
  data.conceptId = parseInt(data.conceptId)
  const idToken = await getIDToken();
  const response = await Axios({
    method: 'post',
    url: `${apiEndpoint}/ontology`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': idToken
    },
    timeout: 6000
  })
}

export async function updateOntology(
  data: any
): Promise<void> {
  console.log("updating data", data);
  const idToken = await getIDToken();
  const response = await Axios({
    method: 'put',
    url: `${apiEndpoint}/ontology`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': idToken
    },
    timeout: 6000
  })
}

export async function searchOntology(
  data: any
): Promise<Ontology[]> {
  const idToken = await getIDToken();
  const response = await Axios({
    method: 'get',
    url: `${apiEndpoint}/search/${data}`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': idToken
    },
    timeout: 6000
  })
  if (response.data.length > 0) {
    return response.data;
  }
  return [];
}




