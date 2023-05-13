const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'hospital',
  password: 'admin',
  port: 5432,
});

const getPatient = () => {
    return new Promise(function(reslove,reject) {
        const qry = 'SELECT * FROM public."patients" ORDER BY pid ASC RETURN *';
        pool.query('SELECT * FROM public."patients" ORDER BY pid ASC', (error,results) => {
            if(error) {
                reject(error)
            }
            reslove(results.rows);
        })
    })
}

const createPatient = (body) => {
    return new Promise(function (resolve, reject) {
        const { name, phone } = body
        pool.query('INSERT INTO public.patients (name, phone) VALUES ($1, $2) RETURNING *', [name, phone], (error, _) => {
            if (error) reject(error)
            resolve(`A new patient has been added:${name}`)
        })
    })
}


module.exports = {
    getPatient,
    createPatient,
}