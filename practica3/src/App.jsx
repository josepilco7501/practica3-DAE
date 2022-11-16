import React,{Component} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      postulantes:[],
      pos:null,
      titulo:'POSTULANTES',
      id:0,
      nombre:'',
      dni:'',
      perfil:'',
      nivel:'',
      fecha_nacimiento:''
    })
    this.cambioNombre = this.cambioNombre.bind(this);
    this.cambioDni = this.cambioDni.bind(this);
    this.cambioPerfil = this.cambioPerfil.bind(this);
    this.CambioNivel = this.cambioNivel.bind(this);
    this.cambioFecha= this.cambioFecha.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);
  }

  cambioNombre(e){
    this.setState({
      nombre: e.target.value
    })
  }

  cambioDni(e){
    this.setState({
      dni: e.target.value
    })
  }

  cambioPerfil(e){
    this.setState({
      perfil: e.target.value
    })
  }

  cambioNivel(e){
    this.setState({
      nivel: e.target.value
    })

  }
  cambioFecha(e){
    this.setState({
      fecha_nacimiento: e.target.value
    })
  }

  componentDidMount(){
    axios.get('http://localhost:8000/postulantes')
    .then(res =>{
      console.log(res.data);
      this.setState({postulantes: res.data})
    })
  }

  mostrar(cod,index){
    axios.get('http://localhost:8000/postulante/'+cod)
    .then(res => {
      this.setState({
        pos: index,
        titulo: 'Editar',
        id: res.data.id,
        nombre :res.data.nombre,
        dni : res.data.dni,
        perfil : res.data.perfil,
        nivel : res.data.nivel,
        fecha_nacimiento: res.data.fecha_nacimiento,
      })
    })
  }

  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    const datos = {
      nombre :this.data.nombre,
      dni : this.data.dni,
      perfil : this.data.perfil,
      nivel : this.data.nivel,
      fecha_nacimiento: this.data.fecha_nacimiento,
    }
    if(cod>0){
      //edición de un registro
      axios.put('http://localhost:8000/postulante/'+cod,datos)
      .then(res =>{
        let indx = this.state.pos;
        this.state.postulantes[indx] = res.data;
        var temp = this.state.postulantes;
        this.setState({
          pos:null,
          titulo:'Nuevo',
          id:'',
          nombre:'',
          dni:'',
          perfil:'',
          nivel:'',
          fecha_nacimiento:'',
          postulantes: temp
        });
      }).catch((error) =>{
        console.log(error.toString());
      });
    }else{
      //nuevo registro
      axios.post('http://localhost:8000/postulantes',datos)
      .then(res => {
        this.state.postulantes.push(res.data);
        var temp = this.state.postulantes;
        this.setState({
          id:0,
          nombre:'',
          dni: '',
          perfil:'',
          nivel:'',
          fecha_nacimiento:'',
          postulantes:temp
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    }
  }

  eliminar(cod){
    let rpta = window.confirm("Desea Eliminar?");
    if(rpta){
      axios.delete('http://localhost:8000/postulante/'+cod)
      .then(res =>{
        var temp = this.state.postulantes.filter((postulante)=>postulante.id !== cod);
        this.setState({
          postulantes: temp
        })
      })
    }
  }

  render() {
    return (
    <div>
      <Container>
              <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Dni</th>
                  <th>Perfil</th>
                  <th>Nivel</th>
                  <th>Fecha Nacimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {this.state.postulantes.map( (postulante,index) =>{
                  return (
                    <tr key={postulante.id}>
                      <td>{postulante.id}</td>
                      <td>{postulante.nombre}</td>
                      <td>{postulante.dni}</td>
                      <td>{postulante.perfil}</td>
                      <td>{postulante.nivel}</td>
                      <td>{postulante.fecha_nacimiento}</td>
                      <td>
                      <Button variant="success" onClick={()=>this.mostrar(postulante.id,index)}>Editar</Button>
                      <Button variant="danger" onClick={()=>this.eliminar(postulante.id)}>Eliminar</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <hr />
            <h1>{this.state.titulo}</h1>
            <Form onSubmit={this.guardar}>
              <Form.Control type="hidden" value={this.state.id} />
              <Form.Group className="mb-3">
                <Form.Label>Ingrese Nombre:</Form.Label>
                <Form.Control type="text" value={this.state.nombre} onChange={this.cambioNombre} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ingrese Dni:</Form.Label>
                <Form.Control type="number" value={this.state.dni} onChange={this.cambioDni} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Perfil</Form.Label>
                <Form.Control type="text" value={this.state.perfil} onChange={this.cambioPerfil} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nivel:</Form.Label>
                <Form.Control type="text" value={this.state.nivel} onChange={this.cambioNivel} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Nacimiento:</Form.Label>
                <Form.Control type="date" value={this.state.fecha_nacimiento} onChange={this.cambioFecha} />
              </Form.Group>
              <Button variant="primary" type="submit">
                GUARDAR
              </Button>
          </Form>
        </Container>

    </div>)
  }
}

export default App
