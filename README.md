# Pasos para implementar React360

# Pasos para implementar React360

## Antes que nada
Dirigete a [Poly](https://developers.google.com/poly/develop/web) y genera una API key para usar este servicio de Google. Para qué sirve Poly?es una librería donde la gente comparte, busca y hacen "remix" de assets 3D. Para más información puedes visitar [este enlace](https://developers.google.com/poly/develop).

## Empecemos

### 0 - Ya instalado React 360
Recuerda que antes de, deberías instalar la línea de comandos de React 360 de manera global `npm install -g react-360-cli` e iniciar tu primer proyecto con `react-360 init Hello360`.

### 1 - Implementando nuestro manejador de estado
No usaremos Redux, porque es pequeña la aplicación pero demos de usar o crear algo parecido, por lo que crearemos un archivo `Store.js` el cual nos servirá para tener el manejo del estado de nuestra pequeña aplicación, muy parecido a Redux. Recordemos que siempre es necesario poder tener un estado compartido cuando trabajamos con React, es una buena practica realizar este tipo de patrones.

Algo importante a tener en cuenta en nuestro código es que **React 360** por el momento solo soporta objetos 3D tipo `OBJ` y `GLTF`.

`git checkout 1_store`

### 2 - Creando el componente inicial
Como traeremos los objetos a renderizar desde **Poly** tendremos que mostrar algo mientras son obtenidos estos, por ende preguntamos si hay data en nuestro `Store.js` y sino mostramos un componente inicial, este mostrará una vista por defecto y en el momento de tener todos los objetos cargados mostrará el detalle de cada uno.

`git checkout 2_current_post`

### 3 - Mostrando el menu de objetos
Este componente nos ayudará a navegar por los objetos obtenidos desde **Poly**, será nuestro navegador o menú entre objetos a seleccionar, este componente actualizará el estado de nuestra aplicación para que se muestre cada uno correctamente.

### 4 - El componente que mostrará los objetos 3D
Esta parte es un poco extensa pero lo mejor es explicarlo en código. 

```js
import * as React from 'react';
import { Animated, View } from 'react-360';
import Entity from 'Entity';
import AmbientLight from 'AmbientLight';
import PointLight from 'PointLight';
import { connect } from './Store';

const AnimatedEntity = Animated.createAnimatedComponent(Entity);

class ModelView extends React.Component {
  rotation = new Animated.Value(0);

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.props.current) {
      this.rotation.setValue(0);
      Animated.timing(this.rotation, { toValue: 360, duration: 20000 }).start();
    }
  }

  render() {
    if (!this.props.posts || this.props.current < 0) {
      return null;
    }
    const post = this.props.posts[this.props.current];
    const source = post.source;
    return (
      <View>
        <AmbientLight intensity={1.0} color={'#ffffff'} />
        <PointLight
          intensity={0.4}
          style={{ transform: [{ translate: [0, 4, -1] }] }}
        />
        <AnimatedEntity
          style={{ transform: [{ rotateY: this.rotation }] }}
          source={{ gltf2: source.root.url }}
        />
      </View>
    );
  }
}

const ConnectedModelView = connect(ModelView);

export default ConnectedModelView;
```
 Comencemos explicando cada librería importada como por ejemplo `Aminated`. Esta librería es importada desde **React 360** y según la documentación esta es más que una libreía, es una API que nos ayuda a manejar fácilmente los efectos que tengamos que realizar a nuestro objeto, originalmente está es traída de **React Native** la cual es usada para animar, combinar y componer animaciones, interpolar y manejar eventos gestuales entre otras cosas, es decir que es una poderosa API que nos ayudará a darle efectos a nuestro objeto 3D.

 La segunda librería intersante importada es `Entity`, este sí es un componente de **React 36** el cual renderiza a partir de recursos externos nuestros objetos 3D, por ende es pasado al creado de animaciones de `Animated`.

El siguiente recurso es `AmbientLight`, este recurso es una librería de `ThreeJS` usada para iluminar todos los objetos de la escena de manera global y sin ningua dirección, por ende le ponemos los valores del color de la iluminación y la intensidad.. ..[doc](https://threejs.org/docs/#api/en/lights/AmbientLight) 

Y por último tenemos otro recurso de `ThreeJS` llamado **PointLight** el cual nos sirve para emitir luz desde un punto

### 5 - Registrando los componentes y creando todas las superficies para nuestros objetos

En el archivo `index.js` si o si debemos registrar todos los componentes que vayamos a usar, además que en este inicializamos nuestro `Store` el cual traerá y almacenará todos los datos obtenidos de **Poly**.

Las superficies las crearemos en el archivo `client.js` y en estas denotaremos el tamaño de cada una de las superficies, la posición y qué componente registrado irá en cada una, en este ejemplo con cierto angulo también.


Ya podremos ver nuestra página web en 360 😎🎉