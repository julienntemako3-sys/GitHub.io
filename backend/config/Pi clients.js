// config/piClient.js
// Client HTTP pour dialoguer avec Pi Network Server API

const axios = require('axios');


const PI_API_BASE_URL =
  process.env.PI_API_BASE_URL ||
  'https://api.minepi.com/v2';


const PI_API_KEY = process.env.PI_API_KEY;



if (!PI_API_KEY) {

  console.warn(
    '[piClient] ATTENTION : PI_API_KEY n\'est pas défini dans .env'
  );

}



const headers = {
  'Content-Type':'application/json'
};



if (PI_API_KEY) {

  headers.Authorization = `Key ${PI_API_KEY}`;

}



const piApi = axios.create({

  baseURL: PI_API_BASE_URL,

  headers,

  timeout:10000

});



// Gestion globale des erreurs Pi API
piApi.interceptors.response.use(

  response => response,

  error => {

    if(error.response){

      console.error(
        '[Pi API Error]',
        error.response.status,
        error.response.data
      );

    } else {

      console.error(
        '[Pi API Network Error]',
        error.message
      );

    }


    return Promise.reject(error);

  }

);



module.exports = {
  piApi
};
