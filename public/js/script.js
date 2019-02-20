
let baseURL;
let msgList;

$(() => {

    let  user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): null;
    let header=null;

    baseURL = location.href;
    msgList = $('#msgList');
    let formLoginModal = $("#formLoginModal");
    let formRegistrationModal = $("#formRegistrationModal");
    let formAddModal = $("#formAddModal");

    $("#addPhoto").click((e)=>{
        e.preventDefault();
        formAddModal.modal('show');
    });

    formAddModal.on('hidden.bs.modal', function() {
        $(this).find("input,textarea,select").val('').end();

    });


    $("#showLoginForm").click((e)=>{
        e.preventDefault();
        formLoginModal.modal('show');
    });

    formLoginModal.on('hidden.bs.modal', function() {
        $(this).find("input,textarea,select").val('').end();

    });
    $("#showRegistrationForm").click((e)=>{
        e.preventDefault();
        formRegistrationModal.modal('show');
    });

    formRegistrationModal.on('hidden.bs.modal', function() {
        $(this).find("input,textarea,select").val('').end();

    });




    const getQuery = (url) =>{
        return $.ajax(
            {
                url: url,
                type: 'GET',
                processData: false,
                contentType: false
            }
        );
    };

    getQuery('photos').then(result => printPhotos(result));




    let checkAuth = () =>{
        if(user!==null){
            header = {"Token":user.token};

            $( "#showLoginForm" ).hide();
            $( "#showRegistrationForm" ).hide();
            $( "#btnLogout" ).show();
            $('#addPhoto').show();

        }
        else{
            header= null;
            $('#addPhoto').hide();
            $( "#btnLogout" ).hide();
            $( "#showLoginForm" ).show();
            $( "#showRegistrationForm" ).show();
        }
    };

    checkAuth();

    $('#btnRegistration').on('click', (e) =>{
        e.preventDefault();

        const data = new FormData(document.getElementById('formRegistration'));

        $.ajax({
            url: 'http://localhost:8000/users',
            data: data,
            processData: false,
            contentType: false,
            type: 'POST'
        }).then(responce => {
            localStorage.setItem('user', JSON.stringify(responce));
            document.location.reload();
        });

    });


    $('#btnLogout').on('click', (e) => {
        e.preventDefault();

        if(user !== null){

            $.ajax({
                url: 'http://localhost:8000/users/sessions',
                headers: header,
                processData: false,
                contentType: false,
                type: 'DELETE'
            }).then(() =>{
                localStorage.removeItem('user');
                document.location.reload();

            })
        }

    });


    $('#btnLogin').on('click', (e) =>{
        e.preventDefault();

        const data = new FormData(document.getElementById('formLogin'));

        $.ajax({
            url: 'http://localhost:8000/users/sessions',
            data: data,
            headers: header,
            processData: false,
            contentType: false,
            type: 'POST'
        }).then(responce =>{
            localStorage.setItem('user', JSON.stringify(responce));
            document.location.reload();

        });

    });
    $('#btnAdd').on('click', (e) =>{
        e.preventDefault();

        const data = new FormData(document.getElementById('formAdd'));
        data.append('user', user.name);

        $.ajax({
            url: 'http://localhost:8000/photos/',
            data: data,
            headers: header,
            processData: false,
            contentType: false,
            type: 'POST'
        }).then(() =>{
            document.location.reload();
        });


    });





    const printPhotos = (data) =>{
        let container = msgList;
        container.empty();
        $('#wrapper').append(container);
        for(let i = 0; i < data.length; i++) {
            let div = $('<div id="mess" class="message-album">');

            let title = $(`<p  id="title${data[i]._id}">`).text("Title: " + data[i].title);
            let author = $(`<p  id="title${data[i]._id}">`).text("Author: " + data[i].user.username);

            let image = $(`<img id= "image${data[i]._id}" class="img-thumbnail" style="cursor:zoom-in;">`);
            if(data[i].photo) {
                image.attr("src", baseURL + "/uploads/" + data[i].photo);
            }
            else{
                image.attr("src", baseURL + "/uploads/noimage.jpeg");
            }


            div.append(image, title, author);

            if(user!==null && user.role==='admin') {
                let buttonDel = $(`<button id="btnDel${data[i]._id}" class="btn-link">Delete image</button>`);

                div.append(buttonDel);
            }
            container.append(div);


            $(`#btnDel${data[i]._id}`).on('click', () =>{
                $.ajax({
                    headers: header,
                    url: baseURL + 'photos/' + data[i]._id,
                    type: 'DELETE',
                    processData: false,
                    contentType: false
                })
                    .then(() => {
                        getQuery('photos').then(result => printPhotos(result));
                    });

            });



            $(`#image${data[i]._id}`).click(function(){
                let img = $(this);
                let src = img.attr('src');
                $("body").append("<div class='popup'>"+
                    "<div class='popup_bg'></div>"+
                    "<img src='"+src+"' class='popup_img' />"+
                    "</div>");
                $(".popup").fadeIn(50);
                $(".popup_bg").click(function(){
                    $(".popup").fadeOut(50);
                    setTimeout(function() {
                        $(".popup").remove();
                    }, 50);
                });
            });


        }
    };


});