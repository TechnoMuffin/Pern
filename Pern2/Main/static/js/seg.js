////////////////////////////////////////////
//Asignación de funciones a elementos HTML//
////////////////////////////////////////////
/*Aqui se conecta Javascript con FRONTEND, betch!
Y usamos variables universalessss, mas info aqueeh: http://librosweb.es/libro/javascript/capitulo_4/ambito_de_las_variables.html*/

//Variables de /pupilFollowing
var cbxCourse = $("#cbxCourse");
var cbxCourseB = $("#cbxCourseB");
var cbxCourseD = $("#cbxCourseD");
var cbxModule = $("#cbxModule");
var cbxModuleB = $("#cbxModuleB");
var cbxModuleD = $("#cbxModuleD");
var cbxProject = $("#cbxProject");
var cbxActivity = $("#cbxActivity");
var cbxStudent = $("#cbxStudent");
var currentStudentSelected; //Necesitaremos guardar en esta variable el alumno seleccionado para algunas funciones
var cbxProjectFW = $("#cbxProjectFW");
var personalFollowHTML = $("#personalFollow")
var tableStudents = $('#myTable'); //Table PupilFollowing
var tbStudent = $("#tbAlumnos"); //Body table PupilFollowing
var docStudents = $('#docTable'); //Table Document
var tbDocument = $("#tbDocument"); //Body Table de Document
var date = $('#datepicker');
var nameStudentHTML = $('.nameStudent')
//Activity fields
var actName=$('#actName');
var actCode=$('#actCode');
var actStatus=$('#actStatus');
var actClasses=$('#actClasses');
var actCalification=$('#actCalification');
var tbFF = $('#tbFulfillments'); //Tabla de cumplimientos

//Variables de /rotacionAlumno
var cbxCourseRotation = $("#cbxCourseRotation");
var cbxRotationA = $("#cbxRotationA");
var cbxRotationB = $("#cbxRotationB");
var toSelectB = $("#toSelectB");
var toSelectA = $("#toSelectA");
var toSelectB1 = $("#toSelectB1");
var toSelectA1 = $("#toSelectA1");
var allToSelectB = $("#allToSelectB");
var allToSelectB1 = $("#allToSelectB1");
var allToSelectA = $("#allToSelectA");
var allToSelectA1 = $("#allToSelectA1");
var studentSelectA = $("#studentSelectA");
var studentSelectB = $("#studentSelectB");
var selecterDiv = $('#selectionerDiv');
var txtRotationName = $('#txtRotationName');
var btnCreateRotation = $('#createRotation');
var deleteSelectA = $('#deleteSelectA');
var deleteSelectB = $('#deleteSelectB');
var modalTitle = $('#modal-title');
var modalText = $('#modal-text');
var modalito = $('#modal');
var cbxCourseG = $('#cbxCourseG');
var cbxRotationG = $('#cbxRotationG');
var cbxNewModuleG = $('#cbxNewModuleG');
var btnUpdateRotation = $('#btnUpdateRotation');
var actualModule = $('#actualModule');

//Variables de /historial
var tableHistory = $('#historyTable'); //Table History
var tbHistory = $('#tbHistory'); //Body Table History


tableHistory.css('max-height', $( window ).height());


//Asignacion de Funciones a elementos HTML
cbxProjectFW.on('change', function(){projectWFChanged()});
cbxCourse.on('change', function(){courseChanged()});
cbxCourseD.on('change', function(){courseChangedD()});
cbxCourseB.on('change', function(){courseChangedB()});
cbxModule.on('change', function(){moduleChanged()});
cbxModuleD.on('change', function(){moduleChangedD()});
cbxModuleB.on('change', function(){moduleChangedB()});
cbxProject.on('change', function(){projectChanged()});
cbxActivity.on('change', function(){activityChanged()});
cbxStudent.on('change', function(){studentChanged()});
cbxCourseRotation.on('change', function(){courseRotationChanged()});
tableStudents.on('click', '.clickable-row', function(event) {$(this).addClass('active').siblings().removeClass('active');});
docStudents.on('click', '.clickable-row', function(event) {$(this).addClass('active').siblings().removeClass('active');});

///Template rotacionAlumno
cbxRotationA.on('change', function(){cbxRotationAchanged()});
cbxRotationB.on('change', function(){cbxRotationBchanged()});
toSelectB.on('click', function(){toSelectMulB()});
toSelectB1.on('click', function(){toSelectMulB()});
toSelectA.on('click', function(){toSelectMulA()});
toSelectA1.on('click', function(){toSelectMulA()});
allToSelectB.on('click', function(){allToSelectMulB()});
allToSelectB1.on('click', function(){allToSelectMulB()});
allToSelectA.on('click', function(){allToSelectMulA()});
allToSelectA1.on('click', function(){allToSelectMulA()});
btnCreateRotation.on('click', function(){createRotation()});
deleteSelectA.on('click', function(){deleteRotation(cbxRotationA)});
deleteSelectB.on('click', function(){deleteRotation(cbxRotationB)});
cbxCourseG.on('change', function(){courseGChanged()});
cbxRotationG.on('change', function(){rotationGChanged()});
btnUpdateRotation.on('click', function(){updateRotation()});


/////////////////////////////////
//Funciones para limpiar campos//
/////////////////////////////////

function resetTable(tabla){
    tabla.empty();
}

function resetCbx(cbx,defoul, value=''){
    cbx.empty();
    cbx.append(new Option(defoul, value));
    cbx.selectpicker('refresh');
}

function resetMultiSelect(slct){
    slct.empty();
    slct.change();
}

function resetActivityData(){
    actName.text('---');
    actCode.text('---');
    actStatus.text('---');
    actClasses.text('---');
    actCalification.text('---');
}

function resetPersonalFollow(){
    resetCbx(cbxProject,'Proyectos');
    resetCbx(cbxActivity,'Actividad');resetActivityData();;
    personalFollowHTML.addClass('disabledDIV');
}

///////////////////////
//Funciones para AJAX//
///////////////////////

//Esta funcion hace algo
function courseChanged(){
    resetCbx(cbxModule,'Módulo');
    resetTable(tbStudent);
    resetPersonalFollow();
    resetTable(tbHistory);
    resetCbx(cbxStudent,'Alumno');resetTable(tbHistory);;
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "subjects"},
            dataType: 'json',
            success: function(info){
                resetCbx(cbxModule,'Módulo');
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
function courseChangedB(){
    resetCbx(cbxModuleB,'Módulo');

    resetPersonalFollow();
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourseB.val(), queryId: "subjects"},
            dataType: 'json',
            success: function(info){
                resetCbx(cbxModuleB,'Módulo');
                for(var i=0;i<info.length;i++){
                    //El valor de las opciones de los select es el ID de los modulos
                    var text = info[i].fields.nameModule;
                    var value = info[i].pk;
                    cbxModuleB.append(new Option(text, value));
                }
                cbxModuleB.selectpicker('refresh');
            }
        });
    }
}
function courseChangedD(){
    resetCbx(cbxModuleD,'Módulo');
    resetPersonalFollow();
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourseD.val(), queryId: "subjects"},
            dataType: 'json',
            success: function(info){
                resetCbx(cbxModuleD,'Módulo');
                for(var i=0;i<info.length;i++){
                    //El valor de las opciones de los select es el ID de los modulos
                    var text = info[i].fields.nameModule;
                    var value = info[i].pk;
                    cbxModuleD.append(new Option(text, value));
                }
                cbxModuleD.selectpicker('refresh');
            }
        });
    }
}

function projectWFChanged(){
    resetTable(tbStudent);
    resetCbx(cbxProject,'Proyectos');
    resetPersonalFollow();
    resetTable(tbHistory);
    if(this.val!=''){
        //CARGA ALUMNOS
        $.ajax({
            url: url,
            type: 'GET',
            data: {idModule: cbxModule.val(), queryId: "rotationsByModule"},
            dataType: 'json',
            success: function(rotationInfo){
                for (u=0;u<rotationInfo.length;u++){
                    $.ajax({
                        url: url,
                        type: 'GET',
                        data: {idRotation: rotationInfo[u].pk, queryId: "studentsByRotation"},
                        dataType: 'json',
                        success: function(info){
                            for(var i=0;i<info.length;i++){
                                var texto = info[i].fields.name + " " + info[i].fields.surname;
                                var value = info[i].pk;
                                var elemento = '<tr claMóduloss="clickable-row" onclick="selectStudent(event,'+value+')"><td><input type="checkbox"></td><td>'+texto+'</td><td style="text-align:center;"><select><option value="">---</option></select></td></tr>';
                                tbStudent.append(elemento);
                                try{
                                    cbxStudent.append(new Option(texto,value));
                                }catch(err){console.log(err)}
                            }
                            try{
                                cbxStudent.selectpicker('refresh');
                            }catch(e){console.log(err)}
                        }
                    });
                }
            }
        });
        $.ajax({
            url: url,
            type: 'GET',
            data: {idProject: cbxProjectFW.val(), queryId: "fulfillments"},
            dataType: 'json',
            success: function(info){
                resetTable(tbFF);
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
    resetCbx(cbxStudent,'Alumno');resetTable(tbHistory);;
    resetTable(tbStudent);
    resetCbx(cbxProject,'Proyectos');
    resetPersonalFollow();
    //Carga de Alumnos
    $.ajax({
        url: url,
        type: 'GET',
        data: {idModule: cbxModule.val(), queryId: "rotationsByModule"},
        dataType: 'json',
        success: function(rotationInfo){
            for (u=0;u<rotationInfo.length;u++){
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: {idRotation: rotationInfo[u].pk, queryId: "studentsByRotation"},
                    dataType: 'json',
                    success: function(info){
                        for(var i=0;i<info.length;i++){
                            var texto = info[i].fields.name + " " + info[i].fields.surname;
                            var value = info[i].pk;
                            try{
                                cbxStudent.append(new Option(texto,value));
                            }catch(err){console.log(err)}
                        }
                        try{
                            cbxStudent.selectpicker('refresh');
                        }catch(e){console.log(err)}
                    }
                });
            }
        }
    });

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
function moduleChangedB(){
    resetTable(tbDocument);
    resetPersonalFollow();
    //Carga de Projectos
    $.ajax({
        url: url,
        type: 'GET',
        data: {module: cbxModuleB.val(), queryId: "projects"},
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
    $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourseB.val(), queryId: "documents"},
            dataType: 'json',
            success: function(info){
                resetTable(tbDocument);
                for(var x=0;x<info.length;x++){
                    nameDoc = info[x]['fields']['nameDocument'];
                    courDoc = info[x]['fields']['idCourse'];
                    moduDoc = info[x]['fields']['idModule'];
                    comDoc = info[x]['fields']['commentDoc'];
                    var elemento = '<tr><td><a href="#"><i class="glyphicon glyphicon-file"   ></i></a></td><td>'+ nameDoc+ '</td><td>En proceso</td><td value="+courDoc+">'+ courDoc+'</td><td>'+ moduDoc+'</td><td>'+ comDoc +'</td><td><a href="#"><i class="glyphicon glyphicon-edit" ></i></a><a href="#"><i class="glyphicon glyphicon-trash" style="left: 10px;"></i></a><a href="#"><i class="glyphicon glyphicon-save" style="left: 20px;"</td></tr>';
                    tbDocument.append(elemento);
                }
            }
        });

}

function moduleChangedD(){
    
    resetPersonalFollow();

    //Carga de Projectos
    $.ajax({
        url: url,
        type: 'GET',
        data: {module: cbxModuleD.val(), queryId: "projects"},
        dataType: 'json',
        success: function(info){
            for(var i=0;i<info.length;i++){
                //El valor de las opciones de los select es el ID de los proyectos
                var nameModule = info[i].fields.nameModule;
                var value = info[i].pk;
                cbxModuleD.append(new Option(nameModule, value));

            }
            cbxModuleD.selectpicker('refresh');

        }
    });
}



function projectChanged(){
    resetCbx(cbxActivity,'Actividad');resetActivityData();;
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


function studentChanged(){
    //Cuando el select cbxStudent cambia de valor carga los datos correspondientes del alumno
    resetTable(tbHistory);
    console.log(cbxStudent.val());
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idStudent: cbxStudent.val(), queryId: "history"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var idSF=info[i].pk;
                    for(var v=0;v<info.length;v++){
                        if(info[v].model=='database.onclass'){
                            if(info[v].fields.idSF==idSF){
                                var activity = info[v].fields.idActivity[1];
                                var project = info[v].fields.idActivity[2];
                                v=info.length;
                            }
                        }
                    }
                    var presencia = info[i].fields.presenceSF;
                    var fecha = info[i].fields.dateSF;
                    var obs = info[i].fields.commentPF;
                    sinObs='<td><button type="button" class="btn btn-warning pull-right disabledDIV">'+
                        '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>'+
                        '</button></td>';
                    if(info[i].model=="database.studentfollowing"){
                        if(presencia){
                            presencia='<span class="glyphicon glyphicon-ok verde" aria-hidden="true"></span>';
                            var elemento = '<tr class="clickable-row">'+
                                '<th scope="row">'+presencia+'</th>'+
                                '<td>'+fecha+'</td>'+
                                '<td>'+activity+' de '+project+'</td>';
                            if(obs!=''){
                                elemento=elemento+'<td>'+createModalObs('modal'+idSF,obs)+'</td></tr>';
                            }else{
                                elemento=elemento+sinObs;
                            }
                        }else{
                            presencia='<span class="glyphicon glyphicon-remove rojo" aria-hidden="true"></span>';
                            var elemento = '<tr class="clickable-row">'+
                                '<th scope="row">'+presencia+'</th>'+
                                '<td>'+fecha+'</td>'+
                                '<td>Alumno Ausente</td>';
                            elemento=elemento+sinObs;
                        }
                        tbHistory.append(elemento);
                    }
                }
            }
        });
    }
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
    console.log(valor);
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
    activityChanged();
}


///////Template 'rotacionAlumno'////////

function courseRotationChanged(){
    resetCbx(cbxRotationA,'Alumnos sin Rotación','0');
    resetCbx(cbxRotationB,'Alumnos sin Rotación','0');
    resetMultiSelect(studentSelectA);
    resetMultiSelect(studentSelectB);
    if($(this).val!=''){
        selecterDiv.removeClass('disabledDIV');
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourseRotation.val(), queryId: "rotations"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var text = info[i].fields.nameRotation;
                    var value = info[i].pk;
                    cbxRotationA.append(new Option(text, value));
                    cbxRotationB.append(new Option(text, value));
                }
                cbxRotationB.val($('#cbxRotationB option:selected').next().val());
                $('#cbxRotationA option:selected').next().addClass('disabledDIV');
                $('#cbxRotationB option:selected').prev().addClass('disabledDIV');
                cbxRotationA.selectpicker('refresh');
                cbxRotationB.selectpicker('refresh');
                ajaxForGetStudentRotation(cbxRotationA, studentSelectA);
                ajaxForGetStudentRotation(cbxRotationB, studentSelectB);
            }
        });
    }else{
        selecterDiv.addClass('disabledDIV');
    }
}

function ajaxForGetStudentRotation(fromCbx, elemento){
    $.ajax({
        url: url,
        type: 'GET',
        data: {idRotation: fromCbx.val(), queryId: "studentsByRotation"},
        dataType: 'json',
        success: function(info){
            for(var i=0;i<info.length;i++){
                var texto = info[i].fields.surname + ", " + info[i].fields.name;
                var value = info[i].pk;
                elemento.append(new Option(texto, value));
                elemento.change();
            }
        }
    });
}

function cbxRotationAchanged(){
    resetMultiSelect(studentSelectA);
    $('#cbxRotationB option').each(function(){
        $(this).removeClass('disabledDIV');
    });
    $('#cbxRotationB option').each(function(){
        $(this).removeClass('disabledDIV');
        if($(this).val()==cbxRotationA.val()){
            console.log(cbxRotationA.val());
            $(this).addClass('disabledDIV');
        }
    });
    cbxRotationB.selectpicker('refresh');
    ajaxForGetStudentRotation(cbxRotationA, studentSelectA);
}

function cbxRotationBchanged(){
    resetMultiSelect(studentSelectB);
    $('#cbxRotationA option').each(function(){
        $(this).removeClass('disabledDIV');
    });
    $('#cbxRotationA option').each(function(){
        $(this).removeClass('disabledDIV');
        if($(this).val()==cbxRotationB.val()){
            console.log(cbxRotationA.val());
            $(this).addClass('disabledDIV');
        }
    });
    cbxRotationA.selectpicker('refresh');
    ajaxForGetStudentRotation(cbxRotationB, studentSelectB);
}

function ajaxForSetStudentsRotations(newRotation,StudentsIDS){
    $.ajax({
        url: url,
        type: 'GET',
        data: {'studentsIds[]':StudentsIDS, newIdRotation: newRotation.val(), queryId: "changeStudentsRotation"},
        dataType: 'json',
        success: function(info){
            console.log('Saved');
        }
    });
}

function toSelectMulB(){
    var items = [];
    $('#studentSelectA option:selected').each(function(){
        items.push($(this).val());
        var element = $(this).detach();
        studentSelectB.append(element);
    });
    ajaxForSetStudentsRotations(cbxRotationB,items);
}


function toSelectMulA(){
    var items = [];
    $('#studentSelectB option:selected').each(function(){
        items.push($(this).val());
        var element = $(this).detach();
        studentSelectA.append(element);
    });
    ajaxForSetStudentsRotations(cbxRotationA,items);
}

function allToSelectMulB(){
    var items = [];
    $('#studentSelectA option').each(function(){
        items.push($(this).val());
        var element = $(this).detach();
        studentSelectB.append(element);
    });
    ajaxForSetStudentsRotations(cbxRotationB,items);
}

function allToSelectMulA(){
    var items = [];
    $('#studentSelectB option').each(function(){
        items.push($(this).val());
        var element = $(this).detach();
        studentSelectA.append(element);
    });
    ajaxForSetStudentsRotations(cbxRotationA,items);
}

function createRotation(){
    if(txtRotationName.val()=='' || cbxCourse.val()=='' || cbxModule.val()==''){
        modalTitle.text('Error');
        modalText.text('Por favor, rellene los campos correctamente.');
        $('#modal').modal('toggle');
    }else{
        $.ajax({
            url: url,
            type: 'GET',
            data: {nameRotation: txtRotationName.val(), idCourse: cbxCourse.val(), idModule: cbxModule.val(), queryId: "createRotation"},
            dataType: 'json',
            success: function(){
            }
        });
        modalText.text('Se ha creado la rotación '+txtRotationName.val()+' correctamente.');
        modalTitle.text('Éxito!');
        $('#modal').modal('toggle');
        txtRotationName.val('');
        cbxCourse.val('');
        cbxCourse.selectpicker('refresh');
        cbxCourseRotation.val('');
        cbxCourseRotation.selectpicker('refresh');
        selecterDiv.addClass('disabledDIV');
        resetCbx(cbxModule,'Módulo');
        resetCbx(cbxRotationA,'Alumnos sin Rotación','0');
        resetCbx(cbxRotationB,'Alumnos sin Rotación','0');
        resetMultiSelect(studentSelectA);
        resetMultiSelect(studentSelectB);
        courseGChanged();
    }
}

function deleteRotation(idRotacion){
    if(idRotacion!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idRotation: idRotacion.val(), queryId: "deleteRotation"},
            dataType: 'json'
        });
        courseRotationChanged();
    }
}

function courseGChanged(){
    actualModule.text('');
    resetCbx(cbxRotationG,'Rotación');
    resetCbx(cbxNewModuleG,'Nuevo Módulo');
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourseG.val(), queryId: "subjects"},
            dataType: 'json',
            success: function(info){
                resetCbx(cbxModule,'Módulo');
                for(var i=0;i<info.length;i++){
                    //El valor de las opciones de los select es el ID de los modulos
                    var text = info[i].fields.nameModule;
                    var value = info[i].pk;
                    cbxNewModuleG.append(new Option(text, value));
                }
                cbxNewModuleG.selectpicker('refresh');
            }
        });
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourseG.val(), queryId: "rotations"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var text = info[i].fields.nameRotation;
                    var value = info[i].pk;
                    cbxRotationG.append(new Option(text, value));
                }
                cbxRotationG.selectpicker('refresh');
            }
        });
    }
}

function rotationGChanged(){
    var esto=cbxRotationG.val();
    if(esto!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourseG.val(), queryId: "rotations"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var value = info[i].pk;
                    if(esto==value){
                        actualModule.text(info[i].fields.idModule[1]);
                        i=info.length;
                    }
                }
            }
        });
    }else{
        actualModule.text('');
    }
}

function updateRotation(){
    $.ajax({
        url: url,
        type: 'GET',
        data: {idRotation: cbxRotationG.val(), idModule: cbxNewModuleG.val(), queryId: "updateRotation"},
        dataType: 'json',
        success: function(){
            console.log('pinpanpummm');
        }
    });
    actualModule.text('');
    rotationGChanged();
}

//////////////////////////////
//Funcion de Modal Bootstrap//
//////////////////////////////
function createModalObs(idCoso,content){
    var someHTML = '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#'+idCoso+'">'+
        '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></button>'+
        '<div id="'+idCoso+'" class="modal fade" role="dialog">'+
        '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '<h4 class="modal-title">Observaciones</h4></div><div class="modal-body">'+
        '<p style="white-space: pre-wrap">'+content+'</p></div><div class="modal-footer">'+
        '<button type="button" class="btn btn-default" data-dismiss="modal">Ok</button>'+
        '</div></div></div></div>';
    return someHTML;
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
