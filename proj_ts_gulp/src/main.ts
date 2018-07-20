import { sayHello } from './greet';

let showHello = (eleName : string, name : string = 'TypeScript') : void => {
    const elt : any = document.querySelector(eleName);
    elt.innerHTML = sayHello(name);
}
showHello('#greeting');