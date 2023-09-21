/// Este es un programa que simula la cración de "drafts", o sea, borradores de equipos de futbol. El programa permite la selección de varios jugadores en una base de datos, y su asignación a diferentes posiciones (Delantero, mediocampista, etcétera). También utiliza un sistema de puntuación de jugadores (media) para puntuar a cada jugador y al promedio del equipo. Debido a que no pude encontrar una API con los datos que necesitaba, decidí crear un archivio JSON con la base de datos de los jugadores, y obterla con el fetch. También usé local storage para guardar los equipos (a modo de base de datos) y para crear un pequeño boton en la esquina inferior derecha que modifica el modo de brillo de la página.

const a_bench = [];
const a_atq_line = [];
const a_mid_line = [];
const a_def_line = [];
const a_por_line = [];

const jugadoresLista = document.getElementById('jugadores_lista');

function parsear_jugador(string_jugador) {
    var jugador = {};
    const partes = string_jugador.split("-");
    jugador.nombre = partes[0];
    jugador.posicion = partes[1];
    jugador.media = parseInt(partes[2]);
    return jugador;
}

function mensaje_informacion(){
Swal.fire({
    title: 'Elija los jugadores que desea en la lista de la izquierda, e ingreselos a su alineación con los controles inferiores.',
    backdrop: `rgba(50, 138, 63, 0.505)`
})
}

function seleccionar_jugador(){
    const botones = document.querySelectorAll('.clase_boton');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            string_seleccionado = boton.textContent;
            jugador = parsear_jugador(string_seleccionado)
            console.log(jugador);
            label_enviar = document.getElementById("array-select-label")
            label_enviar.textContent = `Enviar a ${jugador.nombre} a:`
            return jugador
        });
    });
}

function validar_jugador_existente(jugador) {
    const todos_los_arrays = a_bench.concat(a_atq_line, a_mid_line, a_def_line, a_por_line);
    const jugador_existente = todos_los_arrays.some(jugador_existente => jugador_existente.nombre === jugador.nombre);
    return jugador_existente;
}

function calcular_promedios() {
    function calcular_promedio_array(array){
        let media_total_array = 0;
        for (let i = 0; i < array.length; i++) {
        media_total_array += array[i].media;
        }
        const promedio_array_float = media_total_array / array.length
        const promedio_array = Math.round(promedio_array_float)
        console.log(promedio_array)
        return promedio_array
    }
    const array_media_total = []

    a_bench.forEach(jugador => array_media_total.push(jugador))
    a_atq_line.forEach(jugador => array_media_total.push(jugador))
    a_mid_line.forEach(jugador => array_media_total.push(jugador))
    a_def_line.forEach(jugador => array_media_total.push(jugador))
    a_por_line.forEach(jugador => array_media_total.push(jugador))

    console.log("media total: " + array_media_total)
    const promedio_total = calcular_promedio_array(array_media_total)
    const promedio_def = calcular_promedio_array(a_def_line)
    const promedio_ataque = calcular_promedio_array(a_atq_line)
    const promedio_bench = calcular_promedio_array(a_bench)

    m_total = document.getElementById("m_total")
    m_defensa = document.getElementById("m_defensa")
    m_ataque = document.getElementById("m_ataque")
    m_banca = document.getElementById("m_banca")

    m_total.textContent = promedio_total
    m_defensa.textContent = promedio_def
    m_ataque.textContent = promedio_ataque
    m_banca.textContent = promedio_bench

    if (m_total.textContent === "NaN"){
        m_total.textContent = "-"
    }
    if (m_defensa.textContent === "NaN"){
        m_defensa.textContent = "-"
    }
    if (m_ataque.textContent === "NaN"){
        m_ataque.textContent = "-"
    }
    if (m_banca.textContent === "NaN"){
        m_banca.textContent = "-"
    }
}
function funciones_conjuntas(){
    mostrar_jugadores()
    calcular_promedios()
    submit_feedback()
}

function enviar_jugador(jugador, enviar_a){
    const cantidad_jugadores_total = a_bench.length + a_atq_line.length + a_mid_line.length + a_def_line.length + a_por_line.length;
    const cantidad_jugadores_campo = a_atq_line.length + a_mid_line.length + a_def_line.length + a_por_line.length;
    const jugador_existente = validar_jugador_existente(jugador);

    if (enviar_a === 's_bench' && a_bench.length >= 10) {
        Swal.fire({position: 'center', icon: 'error', title: 'Se ha alcanzado la máxima cantidad de suplentes (10)', timer: 1000, showConfirmButton: false,
    })
        return; 
    }
    if (cantidad_jugadores_total >= 21) {
        Swal.fire({position: 'center', icon: 'error', title: 'Se ha alcanzado la máxima cantidad de miembros del equipo (21)', timer: 1000, showConfirmButton: false,
    })
        return; 
    }
    if (cantidad_jugadores_campo >= 11 && enviar_a != 's_bench') {
        console.log("cantidad_jugadores_campo = " + cantidad_jugadores_campo)
        Swal.fire({position: 'center', icon: 'error', title: 'Se ha alcanzado la máxima cantidad de titulares (11)', timer: 1000, showConfirmButton: false,
    })
        return; 
    }
    if (a_por_line.length >= 1 && enviar_a === 's_por_line'){
        Swal.fire({position: 'center', icon: 'error', title: 'Solo puede haber un portero', timer: 1000, showConfirmButton: false,
    })
        return;
    }
    if (jugador_existente) {
        Swal.fire({position: 'center', icon: 'error', title: 'Este jugador ya está en tu equipo', timer: 1000, showConfirmButton: false,
    })
        return;
    }

    else{
    switch (enviar_a) {
        case 's_bench':
            a_bench.push(jugador);
            console.log(a_bench);
            funciones_conjuntas()
            break;
        case 's_atq_line':
            a_atq_line.push(jugador);
            console.log(a_atq_line);
            funciones_conjuntas()
            break;
        case 's_mid_line':
            a_mid_line.push(jugador);
            console.log(a_mid_line);
            funciones_conjuntas()
            break;
        case 's_def_line':
            a_def_line.push(jugador);
            console.log(a_def_line);
            funciones_conjuntas()
            break;
        case 's_por_line':
            a_por_line.push(jugador);
            console.log(a_por_line);
            funciones_conjuntas()
            break;
        default:
            break;
    }
}
}

function seleccionar_array() {
    jugador = {"nombre": "Lev Yashin", "posicion": "POR", "media": 90
    }
    label_enviar = document.getElementById("array-select-label")
    label_enviar.textContent = `Enviar a ${jugador.nombre} a:`
    
    const form = document.getElementById('formulario-sendto');

    form.addEventListener('submit', function(event) {
    event.preventDefault();

    const select = document.getElementById('array-select');
    const enviar_a = select.value;

    console.log(enviar_a); 

    enviar_jugador(jugador, enviar_a)
});
}

function mostrar_jugadores() {
    const bench_div = document.getElementById('bench');
    const atq_line_div = document.getElementById('atq_line');
    const mid_line_div = document.getElementById('mid_line');
    const def_line_div = document.getElementById('def_line');
    const por_line_div = document.getElementById('por_line');

    bench_div.innerHTML = '';
    atq_line_div.innerHTML = '';
    mid_line_div.innerHTML = '';
    def_line_div.innerHTML = '';
    por_line_div.innerHTML = '';

    function crear_elemento_jugador(jugador, array, div) {
    const jugador_element = document.createElement('div');
    jugador_element.classList.add('tarjeta');
    const nombre_element = document.createElement('span');
    const media_element = document.createElement('span');
    const posicion_element = document.createElement('span');
    const boton_element = document.createElement('button');
    boton_element.classList.add('tarjeta_boton');

    nombre_element.textContent = jugador.nombre;
    media_element.textContent = ` - ${jugador.media}`;
    posicion_element.textContent = ` - ${jugador.posicion} `;
    boton_element.textContent = '✖';

    boton_element.addEventListener('click', () => {
        const index = array.indexOf(jugador);
        if (index !== -1) {
        array.splice(index, 1);
        div.removeChild(jugador_element);
        calcular_promedios();
        }
    });
    jugador_element.appendChild(nombre_element);
    jugador_element.appendChild(media_element);
    jugador_element.appendChild(posicion_element);
    jugador_element.appendChild(boton_element);

    div.appendChild(jugador_element);
    }

    a_bench.forEach(jugador => {
    crear_elemento_jugador(jugador, a_bench, bench_div);
    });

    a_atq_line.forEach(jugador => {
    crear_elemento_jugador(jugador, a_atq_line, atq_line_div);
    });

    a_mid_line.forEach(jugador => {
    crear_elemento_jugador(jugador, a_mid_line, mid_line_div);
    });

    a_def_line.forEach(jugador => {
    crear_elemento_jugador(jugador, a_def_line, def_line_div);
    });

    a_por_line.forEach(jugador => {
    crear_elemento_jugador(jugador, a_por_line, por_line_div);
    });
}

function submit_feedback(){
    const label_feedback = document.getElementById("label_feedback")
    if (a_def_line.length == 0){
        label_feedback.textContent = "Si continuas, tu equipo tendrá una defensa deficiente"
    }
    else if (a_atq_line.length == 0){
        label_feedback.textContent = "Si continuas, tu equipo tendrá un ataque deficiente"
    }
    else if (a_por_line.length == 0){
        label_feedback.textContent = "Elige un portero"
    }
    else {
        label_feedback.textContent = "Tu equipo no tiene problemas"
    }
}


function definir_equipo(){
    const equipo = {
        bench: a_bench,
        atq_line: a_atq_line,
        mid_line: a_mid_line,
        def_line: a_def_line,
        por_line: a_por_line
    }
    return equipo;
}

function guardar_equipo(equipo) {
    var id_equipo = 1
    const send_equipo = document.getElementById('send_equipo');
    send_equipo.addEventListener('click', function(event) {
        label_feedback.textContent = "Se ha enviado tu equipo número " +  id_equipo + " correctamente"
        event.preventDefault();
        localStorage.setItem("equipo_" + id_equipo, JSON.stringify(equipo));
        console.log(equipo)
        id_equipo += 1;
    });
}

function definir_y_guardar_equipo(){
    equipo = definir_equipo()
    guardar_equipo(equipo)
}

function control_brillo() {
    const div_send_to = document.getElementById("send_to");
    const submit_feedback = document.getElementById("submit_feedback");
    const media_feedback = document.getElementById("media_feedback");

    const boton_brillo = document.getElementById("boton_brillo");
    let brillo_estado = localStorage.getItem("brillo_estado") || "oscuro";
    actualizar_estado_brillo();

    boton_brillo.addEventListener('click', () => {
        switch (brillo_estado) {
        case "oscuro":
            brillo_estado = "claro";
            break;
        case "claro":
            brillo_estado = "oscuro";
            break;
        default:
            break;
    }
    localStorage.setItem("brillo_estado", brillo_estado);
    actualizar_estado_brillo();
    });
    function actualizar_estado_brillo() {
    console.log(brillo_estado);
    if (brillo_estado === "oscuro") {
        div_send_to.classList.remove("claro");
        submit_feedback.classList.remove("claro");
        media_feedback.classList.remove("claro");
        div_send_to.classList.add("oscuro");
        submit_feedback.classList.add("oscuro");
        media_feedback.classList.add("oscuro");
    } else if (brillo_estado === "claro") {
        div_send_to.classList.remove("oscuro");
        submit_feedback.classList.remove("oscuro");
        media_feedback.classList.remove("oscuro");
        div_send_to.classList.add("claro");
        submit_feedback.classList.add("claro");
        media_feedback.classList.add("claro");
    }
    }
}

function setear_lista_jugadores(data){
    
    data.forEach(jugador => {
        const li = document.createElement('li');
        li.classList.add("li_boton")
    
        const img_jugador = document.createElement('img');
        img_jugador.src = jugador.imagen;
    
        const boton_jugador = document.createElement('button');
    
        if (jugador.posicion === 'POR'){
            boton_jugador.classList.add("por_class")
        }
        if (jugador.posicion === 'DEF'){
            boton_jugador.classList.add("def_class")
        }
        if (jugador.posicion === 'MID'){
            boton_jugador.classList.add("mid_class")
        }
        if (jugador.posicion === 'ATQ'){
            boton_jugador.classList.add("atq_class")
        }
    
        boton_jugador.classList.add("clase_boton")
        boton_jugador.textContent = `${jugador.nombre} - ${jugador.posicion} - ${jugador.media}`;
    
        li.appendChild(img_jugador);
        li.appendChild(boton_jugador);
        jugadoresLista.appendChild(li);    
        });
}

control_brillo();

fetch('/jugadores_data.json')
.then(response => response.json())
.then(data => {
    mensaje_informacion()
    setear_lista_jugadores(data)
    jugador = seleccionar_jugador();
    seleccionar_array();
    definir_y_guardar_equipo();
})
.catch(error => console.log(error));