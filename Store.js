import * as React from 'react';

/**
Construimos el estado inicial, donde no tendremos ningún post
y el actual estado iniciará en -1
 */
const State = {
  posts: undefined,
  current: -1,
};
/* 
Creamos un objeto Set
*/

const listeners = new Set();

function updateComponents() {
  for (const cb of listeners.values()) {
    cb();
  }
}
/* 
Declaramos el path de poly
*/
const POLY_PATH = 'https://poly.googleapis.com/v1/assets?';
/* 
Y construimos la función que inicializará
la carga de poly
*/
export function initialize(apiKey) {
  // Obtendremos los 5 primeros elementos
  const options = {
    curated: true,
    format: 'GLTF2',
    key: apiKey,
    pageSize: 5,
  };
  // convertimos a formato query (string) los parámetros anteriores
  const queryString = Object.keys(options)
    .map(k => `${k}=${options[k]}`)
    .join('&');
  
  // realizamos la consulta para traer los objetos
  fetch(POLY_PATH + queryString)
    .then(response => response.json())
    .then(body => {
      const entries = body.assets.map(asset => {
        const objSource = asset.formats.filter(
          format => format.formatType === 'GLTF2'
        )[0];
        return {
          id: asset.name,
          name: asset.displayName,
          author: asset.authorName,
          description: asset.description,
          source: objSource,
          preview: asset.thumbnail.url,
        };
      });
      // Actualizamos nuestro estado con las entradas obtenidas
      State.posts = entries;
      updateComponents();
    });
}

export function setCurrent(value) {
  State.current = value;
  updateComponents();
}

/* 
Creamos una función connect parecida a Redux, tiene la misma función
de conectar nuestras clases de React por medio de un estado compartido
*/
export function connect(Component) {
  return class Wrapper extends React.Component {
    state = {
      posts: State.posts,
      current: State.current,
    };

    _listener = () => {
      this.setState({
        posts: State.posts,
        current: State.current,
      });
    };

    componentDidMount() {
      listeners.add(this._listener);
    }

    componentWillUnmount() {
      listeners.delete(this._listener);
    }

    render() {
      return (
        <Component
          {...this.props}
          posts={this.state.posts}
          current={this.state.current}
        />
      );
    }
  };
}