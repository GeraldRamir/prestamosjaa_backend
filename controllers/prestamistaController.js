import emailOlvidePassword from "../helpers/emailOlvidePass.js";
import emailRegistro from "../helpers/EmailRegistro.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import Prestamista from "../models/Prestamista.js";

const registrar= async (req,res)=>{
    const {email, nombre}= req.body;


    // Prevenir duplicados
    const existeUsuario= await Prestamista.findOne({email});

    if(existeUsuario){
        const error= new Error('El usuario ya existe');
        return res.status(400).json({msg:error.message});
    }
   try {
    // guardar Prestamista
    const prestamista = new Prestamista(req.body);
    const prestamistaGuardado= await prestamista.save();

    // Enviar email
    emailRegistro({
        email,
        nombre,
        token:prestamistaGuardado.token
    })
    res.json(prestamistaGuardado);

   } catch (error) {
    console.log(`error: ${error.message}`);
    
   }
}
const perfil= (req,res)=>{
    const {prestamista}= req;
    res.json(prestamista);
}

const confirmar = async (req, res) => {
    try {
        const { token } = req.params;
        console.log('Token recibido:', token);

        const usuarioConfirmar = await Prestamista.findOne({ token });

        if (!usuarioConfirmar) {
            return res.status(400).json({ msg: 'Usuario no encontrado o token inválido' });
        }

        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario confirmado con éxito' });

    } catch (error) {
        console.error('Error en la confirmación:', error.message);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

const autenticar= async (req,res)=>{
    const {email, password}= req.body;
    const usuario= await Prestamista.findOne({email});
    if(!usuario){
        const error= new Error('El usuario no existe');
        return res.status(404).json({msg:error.message});
    }
        // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error= new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg:error.message});
    
    }
    // Revisar el password
    if(await usuario.compararPassword(password)){
        // Autenticar
        usuario.token=generarJWT(usuario.id)
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });

    }else{
        const error= new Error('El password es incorrecto');
        return res.status(403).json({msg:error.message});
    }
}
const olvidePassword= async (req,res)=>{
    const {email}= req.body;
    const existePrestamista= await Prestamista.findOne({email});
    if(!existePrestamista){
        const error= new Error('El usuario no existe');
        return res.status(400).json({msg:error.message});
    }
    try {
        existePrestamista.token= generarID(existePrestamista.id)
        await existePrestamista.save();
        // Enviar Email con instrucciones
        emailOlvidePassword({
            email,
            nombre:existePrestamista.nombre,
            token:existePrestamista.token
        })

        res.json({msg:'Se ha enviado un correo para restablecer tu password'});
        
    } catch (error) {
        console.log(`error: ${error.message}`);
        
    }
    

}
const comprobarToken= async(req,res)=>{
    const {token}= req.params;
    const tokenValido= await Prestamista.findOne({token});
    if(tokenValido){
        // El token es valido el usuairo existe
        res.json({msg:'Token valido'});
      
    }else{
        const error= new Error('Token invalido');
        return res.status(400).json({msg:error.message});
    }
}
const nuevoPassword=  async(req,res)=>{
    const {token}= req.params;
    const {password}= req.body;
    const prestamista=  await Prestamista.findOne({token});
    if(!prestamista){
        const error= new Error('Hubo un error');
        return res.status(400).json({msg:error.message});
    }
    try {
        prestamista.password= password;
        prestamista.token= null;
        console.log(prestamista);
        await prestamista.save();
        res.json({msg:'Password actualizado correctamente'});
        
    } catch (error) {
        console.log(`error: ${error.message}`);
        
    }
    // usuario.password= password;
    // usuario.token= null;
    // usuario.save();
    // res.json({msg:'Password actualizado correctamente'});
}
export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}