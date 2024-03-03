import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
const __filename = fileURLToPath( import.meta.url);
const __dirname = dirname(__filename);


export default __dirname;

///////////////////////
//   Bcrypt hasheo   //
///////////////////////

// Esta funcion helper, hasheara el password que le pasemos por parametro
// la funcion devuelve el password hasheado
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// esta funcion helper compara si lo pasado por parametro es igual que lo almacenado
// la funcion devuelve true false
export const isValidPassword =(user, password) => bcrypt.compareSync(password, user.password)


