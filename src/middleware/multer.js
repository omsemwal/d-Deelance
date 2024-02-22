const multer= require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      // Estrai l'estensione del file originale
      const fileExt = file.originalname.split('.').pop();
      // Usa l'ID utente dal token di autenticazione per il nome del file
      cb(null, req.userId + '.' + fileExt);
    }
  })
  
  const upload = multer({ storage: storage });

  module.exports={upload}