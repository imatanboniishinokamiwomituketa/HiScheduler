$(document).ready(function () {
    // HTML保存
    let addGroup_html = $('.addGroup').html();
    let logout_html = $('.logout').html();
    let login_html = $('.login').html();
    let joinGroup_html = $('.joinGroup').html();
    let addOrganization_html = $('.addOrganization').html();
    let admin = null;
    // グループ追加処理
    function addGroup() {
        let confirmation = confirm('本当にグループを追加しますか？(この操作は取り消せません)')
        if (confirmation) {
            let data = {
                'ajax': 'addGroup',
                'group': $('#group_addGroup').val(),
                'password': $('#password_addGroup').val(),
                'admin': $('#admin_addGroup').val()
            }
            $.ajax({
                dataType: 'json',
                url: './data.php',
                type: 'post',
                data: data
            })
                .done(function (data, dataType) {
                    if (data == 'success') {
                        alert('グループを追加しました');
                        localStorage.setItem('admin', $('#admin_addGroup').val());
                        localStorage.setItem('group', $('#group_addGroup').val());
                        $('#group_addGroup').val('');
                        $('#password_addGroup').val('');
                        refresh();
                    } else if (data == 'already exists') {
                        alert('このグループはすでに登録されています');
                    } else {
                        alert('未入力箇所又は不正入力箇所があります');
                    }
                });
        } else {
            return false;
        }
    }
    // グループ参加処理
    function joinGroup() {
        let data = {
            'ajax': 'joinGroup',
            'group_name': $('#group_join').val(),
            'password': $('#password_join').val(),
            'admin': $('#admin_join').val()
        }
        $.ajax({
            dataType: 'json',
            url: './data.php',
            type: 'post',
            data: data
        })
            .done(function (data, dataType) {
                if (data == 'normal_success') {
                    // localStorage.setItem('admin', '');
                    localStorage.setItem('group', $('#group_join').val());
                    alert('ログインしました');
                    $('#group_join').val('');
                    $('#password_login').val('');
                    refresh();
                } else if (data == 'admin_success') {
                    localStorage.setItem('admin', $('#admin_join').val());
                    localStorage.setItem('group', $('#group_join').val());
                    alert('ログインしました');
                    $('#group_join').val('');
                    $('#password_login').val('');
                    refresh();
                } else {
                    alert('グループ名又は又はパスワードが間違っています');
                }
            });
    }
    // ログイン処理
    function login() {
        let data = {
            'ajax': 'login',
            'organization': $('#organization_login').val(),
            'password': $('#password_login').val()
        }
        $.ajax({
            dataType: 'json',
            url: './data.php',
            type: 'post',
            data: data
        })
            .done(function (data, dataType) {
                if (data == 'success') {
                    localStorage.setItem('organization', $('#organization_login').val());
                    alert('ログインしました');
                    $('#organization_login').val('');
                    $('#password_login').val('');
                    refresh();
                } else {
                    alert('組織名又は又はパスワードが間違っています');
                }
            });
    }
    // 組織追加処理
    function addOrganization() {
        let confirmation = confirm('本当に組織を追加しますか？(この操作は取り消せません)')
        if (confirmation) {
            let data = {
                'ajax': 'addOrganization',
                'organization': $('#organization_add').val(),
                'password': $('#password_add').val(),
                'group': localStorage.getItem('group')
            }
            $.ajax({
                dataType: 'json',
                url: './data.php',
                type: 'post',
                data: data
            })
                .done(function (data, dataType) {
                    if (data == 'success') {
                        alert('組織を追加しました');
                        $('#organization_add').val('');
                        $('#password_add').val('');
                    } else if (data == 'already exists') {
                        alert('この組織はグループ内にすでに登録されています');
                    } else {
                        alert('未入力箇所又は不正入力箇所があります');
                    }
                });
        } else {
            return false;
        }
    }
    // ログアウト処理
    function logout() {
        let confirmation = confirm('本当にログアウトしますか？');
        if (confirmation) {
            localStorage.clear();
            refresh();
        } else {
            return false;
        }
    }
    // 管理者確認
    function checkAdmin() {
        if (localStorage.getItem('admin') == '' || localStorage.getItem('admin') == undefined || localStorage.getItem('admin') == null) {
            localStorage.setItem('admin?', 'false');
        } else {
            let data = {
                'ajax': 'joinGroup',
                'group_name': localStorage.getItem('group'),
                'password': null,
                'admin': localStorage.getItem('admin')
            }
            $.ajax({
                dataType: 'json',
                url: './data.php',
                type: 'post',
                data: data
            })
                .done(function (data, dataType) {
                    if (data == 'admin_success') {
                        localStorage.setItem('admin?', 'true');
                    } else {
                        localStorage.setItem('admin?', 'false');
                    }
                });
        }
    }
    // 組織表示処理
    function displayOrganization() {
        let loggedIn = localStorage.getItem('organization');
        $('.organization').html(loggedIn);
    }
    // グループ表示処理
    function displayGroup() {
        checkAdmin()
        let groupIn = localStorage.getItem('group');
        let adminIn = localStorage.getItem('admin?');
        if (adminIn == 'true') {
            $('.group').html(groupIn + ' ' + '管理者');
        } else {
            $('.group').html(groupIn);
        }
    }
    // 管理者表示
    function displayAdmin() {
        checkAdmin();
        let adminIn = localStorage.getItem('admin?');
        if (adminIn == 'true') {
            $('.addOrganization').html(addOrganization_html);
        }
    }
    // リフレッシュ処理
    function refresh() {
        checkAdmin();
        if (localStorage.getItem('group') == null) {
            $('.login').html('');
            $('.logout').html('');
            $('.addOrganization').html('');
            $('.addGroup').html(addGroup_html);
            $('.joinGroup').html(joinGroup_html);
            $('.admin').html('');
        } else {
            $('.addGroup').html('');
            $('.joinGroup').html('');
            $('.logout').html(logout_html);
            if (localStorage.getItem('organization') == null) {
                $('.login').html(login_html);
                $('.addOrganization').html('');
            } else {
                $('.logout').html(logout_html);
                $('.login').html('');
            }
        }
        displayOrganization();
        displayGroup();
        displayAdmin();
        clickFunctions();
    }
    // リフレッシュ
    refresh();
    // 管理者確認
    setInterval(() => {
        checkAdmin();
        if (localStorage.getItem('admin?') == 'true' && $('.addOrganization').html() == '') {
            $('.addOrganization').html(addOrganization_html);
        }
    }, 500);
    function clickFunctions() {
        // ログインクリック時の処理
        $('#submit_login').click(function () {
            login();
        });
        // 組織追加クリック時の処理
        $('#submit_add').click(function () {
            addOrganization();
        });
        // ログアウトクリック時の処理
        $('#submit_logout').click(function () {
            logout();
        });
        $('#submit_addGroup').click(function () {
            addGroup();
        });
        $('#submit_join').click(function () {
            joinGroup();
        });
        $('#admin_login').click(function () {
            $('#password_join').toggle();
            $('#password_join').val('');
            $('#admin_join').toggle();
            $('#normal_login').toggle();
            $('#admin_login').toggle();
            $('#submit_join').val('ログイン');
        });
        $('#normal_login').click(function () {
            $('#password_join').toggle();
            $('#admin_join').toggle();
            $('#admin_join').val('');
            $('#normal_login').toggle();
            $('#admin_login').toggle();
            $('#submit_join').val('参加');
        });
    }
});