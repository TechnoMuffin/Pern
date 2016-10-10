////////////////////////////////////////////
//Asignación de funciones a elementos HTML//
////////////////////////////////////////////
/*Aqui se conecta AJAX con FRONTEND, betch!
Y usamos variables universalessss, mas info aqueeh: http://librosweb.es/libro/javascript/capitulo_4/ambito_de_las_variables.html*/

var cbxCourse = $("#cbxCourse");
var cbxModule = $("#cbxModule");
var tbStudent = $("#tbAlumnos");

cbxCourse.on('change', function(){courseChanged()});
cbxModule.on('change', function(){moduleChanged()});

/////////////////////////////////
//Funciones para limpiar campos//
/////////////////////////////////

//Resetear ComboBox de Alumnos a valores iniciales
function resetStudentTable(){
    tbStudent.empty();
}

//Resetear ComboBox de Módulos a valores iniciales
function resetModuleField(){
    cbxModule.empty();
    cbxModule.append(new Option('Módulo', ''));
    cbxModule.selectpicker('refresh');
}

///////////////////////
//Funciones para AJAX//   El kokoro del codigo
///////////////////////

//Esta funcion hace algo
function courseChanged(){
    resetModuleField();
    resetStudentTable();
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "subjects"},
            dataType: 'json',
            success: function(info){
                resetModuleField();
                cbxModule.empty();
                cbxModule.append(new Option('Módulo', ''));
                for(var i=0;i<info.length;i++){
                    var text = info[i].fields.nameModule;
                    var value = info[i].pk;
                    console.log(text+": "+value);
                    cbxModule.append(new Option(text, value));
                }
                cbxModule.selectpicker('refresh');
            }
        });
    }
}

function moduleChanged(){
    resetStudentTable();
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "students"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var text = info[i].fields.name + " " + info[i].fields.surname;
                    var value = info[i].pk;
                    console.log(text);
                    var elemento = '<tr><td><input type="checkbox"></td><td>'+text+'</td><td style="text-align:center;">C1</td></tr>';
                    tbStudent.append(elemento);
                }
            }
        });
    }
}
