////////////////////////////////////////////
//Asignación de funciones a elementos HTML//
////////////////////////////////////////////
/*Aqui se conecta Javascript con FRONTEND, betch!
Y usamos variables universalessss, mas info aqueeh: http://librosweb.es/libro/javascript/capitulo_4/ambito_de_las_variables.html*/

var cbxCourse = $("#cbxCourse");
var cbxModule = $("#cbxModule");
var cbxProject = $("#cbxProject");
var cbxActivity = $("#cbxActivity");
var cbxProjectFW = $("#cbxProjectFW");

var personalFollowHTML = $("#personalFollow")

var currentStudentSelected; //Necesitaremos guardar en esta variable el alumno seleccionado para algunas funciones

var tableStudents = $('#myTable'); //Table
var tbStudent = $("#tbAlumnos"); //Body table
var tbFF = $('#tbFulfillments'); //Tabla de cumplimientos

var date = $('#datepicker');
var nameStudentHTML = $('.nameStudent')

//Activity fields
var actName=$('#actName');
var actCode=$('#actCode');
var actStatus=$('#actStatus');
var actClasses=$('#actClasses');
var actCalification=$('#actCalification');

cbxProjectFW.on('change', function(){projectWFChanged()});
cbxCourse.on('change', function(){courseChanged()});
cbxModule.on('change', function(){moduleChanged()});
cbxProject.on('change', function(){projectChanged()});
cbxActivity.on('change', function(){activityChanged()});
tableStudents.on('click', '.clickable-row', function(event) {$(this).addClass('active').siblings().removeClass('active');});

/////////////////////////////////
//Funciones para limpiar campos//
/////////////////////////////////

//Vaceiar la tabla de alumnos
function resetStudentTable(){
    tbStudent.empty();
}

//Vaciar la tabla de cumplimientos
function resetFFTable(){
    tbFF.empty();
}

//Resetear ComboBox de Módulos a valores iniciales
function resetModuleField(){
    cbxModule.empty();
    cbxModule.append(new Option('Módulo', ''));
    cbxModule.selectpicker('refresh');
}

function resetProjectField(){
    cbxProject.empty();
    cbxProject.append(new Option('Proyectos', ''));
    cbxProject.selectpicker('refresh');
}

function resetActivityField(){
    cbxActivity.empty();
    cbxActivity.append(new Option('Actividad', ''));
    cbxActivity.selectpicker('refresh');
    resetActivityData();
}
function resetActivityData(){
    actName.text('---');
    actCode.text('---');
    actStatus.text('---');
    actClasses.text('---');
    actCalification.text('---');
}

function resetPersonalFollow(){
    resetProjectField();
    resetActivityField();
    personalFollowHTML.addClass('disabledDIV');
}
///////////////////////
//Funciones para AJAX//
///////////////////////

//Esta funcion hace algo
function courseChanged(){
    resetModuleField();
    resetStudentTable();
    resetPersonalFollow();
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "subjects"},
            dataType: 'json',
            success: function(info){
                resetModuleField();
                for(var i=0;i<info.length;i++){
                    //El valor de las opciones de los select es el ID de los modulos
                    var text = info[i].fields.nameModule;
                    var value = info[i].pk;
                    cbxModule.append(new Option(text, value));
                }
                cbxModule.selectpicker('refresh');
            }
        });
    }
}

function projectWFChanged(){
    resetStudentTable();
    resetProjectField();
    resetPersonalFollow();
    if(this.val!=''){
        //Carga de Alumnos
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "students"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var texto = info[i].fields.name + " " + info[i].fields.surname;
                    var value = info[i].pk;
                    var elemento = '<tr class="clickable-row" onclick="selectStudent(event,'+value+')"><td><input type="checkbox"></td><td>'+texto+'</td><td style="text-align:center;"><select><option value="">---</option></select></td></tr>';
                    tbStudent.append(elemento);
                    // <select id="cbxProjectFW" class="selectpicker" data-width="100%">
                    //     <option value=''>Proyecto</option>
                    // </select>
                }
            }
        });
        $.ajax({
            url: url,
            type: 'GET',
            data: {idProject: cbxProjectFW.val(), queryId: "fulfillments"},
            dataType: 'json',
            success: function(info){
                resetFFTable();
                for(var x=0;x<info.length;x++){
                    nameFF = info[x]['fields']['nameFF'];
                    idFF = info[x]['pk'];
                    var elemento = '<tr><td><input type="checkbox"></td><td value =' + idFF +'>' + nameFF +'</td><td>%</td></tr>';
                    tbFF.append(elemento);
                }
            }
        });
    }
}
//Cambia CBX MODULO
function moduleChanged(){
    resetStudentTable();
    resetProjectField();
    resetPersonalFollow();


    //Carga de Projectos
    $.ajax({
        url: url,
        type: 'GET',
        data: {module: cbxModule.val(), queryId: "projects"},
        dataType: 'json',
        success: function(info){
            for(var i=0;i<info.length;i++){
                //El valor de las opciones de los select es el ID de los proyectos
                var nameProject = info[i].fields.nameProject;
                var value = info[i].pk;
                cbxProject.append(new Option(nameProject, value));
                cbxProjectFW.append(new Option(nameProject, value));
            }
            cbxProject.selectpicker('refresh');
            cbxProjectFW.selectpicker('refresh');
        }
    });
}


function projectChanged(){
    resetActivityField();
    $.ajax({
        url: url,
        type: 'GET',
        data: {idCourse: cbxCourse.val(),
            idProject: cbxProject.val(),
            queryId: "activities"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    //El valor de las opciones de los select es el ID de las Activities
                    var nameActivity = info[i].fields.nameActivity;
                    var value = info[i].pk;
                    cbxActivity.append(new Option(nameActivity, value));
                }
                cbxActivity.selectpicker('refresh');
            }
        });
    }

    function activityChanged(){
        resetActivityData();
        $.ajax({
            url: url,
            type: 'GET',
            data: {idActivity: cbxActivity.val(),
                idStudent: currentStudentSelected,
                queryId: "working"},
                dataType: 'json',
                success: function(info){
                    i=info[0].fields;
                    i2=info[1].fields;
                    actName.text(i2.nameActivity);
                    actCode.text(info[1].pk);
                    if(i.hasFinish){
                        actStatus.css('color','green');
                        actStatus.text('Terminado');
                    }else{
                        actStatus.css('color','yellow');
                        actStatus.text('Pendiente');
                    }
                    actClasses.text(i.numberOfClasses);
                    actCalification.text(i.calification);
                }
            });
        }

        //ACA PASA LA MAGIA DE LA SELECCION DE ESTUDIANTE
        function selectStudent(evt,valor) {
            currentStudentSelected=valor;
            $.ajax({
                url: url,
                type: 'GET',
                data: {idStudent: currentStudentSelected,
                    queryId: "onlyStudent"},
                    dataType: 'json',
                    success: function(info){
                        nameStudentHTML.text(info[0].fields.name+' '+info[0].fields.surname);
                    }
                });
                personalFollowHTML.removeClass('disabledDIV');
                cbxActivity[0].selectedIndex = 0;
                resetActivityData();
            }
>>>>>>> GL-06
