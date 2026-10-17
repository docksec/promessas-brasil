import formulariosData from '../data/formularios.json';
import { isPreenchido } from './config';

/** Endpoint do Web3Forms, que entrega por e-mail os formulários do site (o site não tem backend). */
export const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

/** Chave pública de acesso: só permite enviar para o e-mail cadastrado nela. */
export const web3formsAccessKey = formulariosData.web3forms_access_key;

export const isFormularioConfigurado = isPreenchido(web3formsAccessKey);
