import axios from 'axios'

export const newsAPI = axios.create({
  baseURL: 'https://newsapi.org',
 })
 
export async function getUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

export async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

export async function updateProperties(postfix, value, currentWorkNo, currentUserEmail) {
  try {
    if(!currentWorkNo || !currentUserEmail)
      return null

    var keyname = '';
    var payload = { };
    payload[keyname + 'user_email'] = currentUserEmail
    payload[keyname + 'work_no'] = currentWorkNo
    payload[keyname + postfix] = value

    console.log('updateProperties current work postfix : ' + JSON.stringify(payload))

    const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/work/updateProperties/`, payload);
  
    if (response.status != '200') {
      throw new Error(`Error! delete status: ${response.status}`);
    }
    } catch (err) {
      console.log(err.message)
    } finally {
  }
}

export async function selectProperties(postfix, value, currentWorkNo, currentUserEmail) {
  try {
    if(!currentWorkNo || !currentUserEmail)
      return null

    var keyname = '';
    var payload = { };
    payload[keyname + 'user_email'] = currentUserEmail
    payload[keyname + 'work_no'] = currentWorkNo
    payload[keyname + 'postfix'] = postfix

    console.log('select Properties current work postfix : ' + JSON.stringify(payload))

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/work/selectProperties`, {params: payload})
    return res?.data?.[0]
  } catch (err) {
    //setErr(err.message);
  } finally {
  }
}


export async function selectWorkInfo(currentWorkNo, currentUserEmail) {
  try {
    if(!currentWorkNo || !currentUserEmail)
      return null
      
    var keyname = '';
    var payload = { };
    payload[keyname + 'user_email'] = currentUserEmail
    payload[keyname + 'work_no'] = currentWorkNo

    console.log('select selectWorkInfo current work : ' + JSON.stringify(payload))

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/work/selectWorkInfo`, {params: payload})
    return res?.data?.[0]
  } catch (err) {
    //setErr(err.message);
  } finally {
  }
}