////////////////////////////////////////////
//Asignación de funciones a elementos HTML//
////////////////////////////////////////////
/*Aqui se conecta BACKEND con FRONTEND, betch!
Y usamos variables universalessss, mas info aqueeh: http://librosweb.es/libro/javascript/capitulo_4/ambito_de_las_variables.html*/

var cbxCourse=$("#cbxCourse")
var cbxPupil=$("#cbxPupil")
var cbxSubject=$("#cbxSubject")

cbxCourse.on('change',courseChanged());

/////////////////////////////////
//Funciones para limpiar campos//
/////////////////////////////////

//Resetear ComboBox de Alumnos a valores iniciales
function resetPupilField(){
    cbxPupil.empty();
    cbxPupil.append(new Option('Alumno', ''));
}

//Resetear ComboBox de Módulos a valores iniciales
function resetSubjectField(){
    cbxSubject.empty();
    cbxSubject.append(new Option('Módulo', ''));
}

///////////////////////
//Funciones para AJAX//
///////////////////////

//Esta funcion hace algo
function courseChanged(){
    if(this.val!=''){
        resetSubjectField();
        console.log("entro")
        $.ajax({
            url: "{% url 'Main:seg-al' %}",
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "subjects"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var text = info[i].fields.nameSubject;
                    var value = info[i].pk;
                    console.log(text+":"+value);
                    cbxSubject.append(new Option(text, value));
                }
            }
        });

        /*$.ajax({
        url: "{% url 'app_Main:seg-al' %}",
        type: 'GET',
        data: {idCourse: cbxCourse.val(), queryId: "pupils"},
        dataType: 'json',
        success: function(info){
            cbxPupil.empty();
            cbxPupil.append(new Option("Alumno", ""));
            for(var i=0;i<info.length;i++){
                var text = info[i].fields.namePupil + " " +info[i].fields.surnamePupil;
                var value = info[i].pk;
                cbxPupil.append(new Option(text, value));
            }}});
    return;*/
    }
}