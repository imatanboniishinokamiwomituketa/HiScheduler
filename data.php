<?php
ini_set('display_errors', 0);
define('DSN', 'mysql:host=localhost;dbname=hischeduler');
define('DB_USER', 'root');
define('DB_PASS', '');
$pdo = new PDO(DSN, DB_USER, DB_PASS);
// ログイン処理
if ($_POST['ajax'] == 'login') {
    $organization = $_POST['organization'];
    $password = $_POST['password'];
    try {
        $stmt = $pdo->prepare('SELECT * FROM userData where organization = :organization');
        $stmt->bindParam(':organization', $organization, PDO::PARAM_STR);
        $stmt->execute();
        $organization_password = null;
        foreach ($stmt as $row) {
            $organization_password = $row['password'];
        }
        if (password_verify($password, $organization_password)) {
            echo json_encode('success');
            return false;
        } else {
            echo json_encode('error');
            return false;
        }
    } catch (\Exception $e) {
        echo json_encode('error');
        return false;
    }
    // 組織追加処理
} elseif ($_POST['ajax'] == 'addOrganization') {
    $password = $_POST['password'];
    $organization = $_POST['organization'];
    $group_name = $_POST['group'];
    if ($password == '' || $password == null || $organization == '' || $organization == null || $group_name == '' || $group_name == null) {
        echo json_encode('error');
    } else {
        $password = password_hash($password, PASSWORD_DEFAULT);
        try {
            $stmt = $pdo->prepare('SELECT count(*) FROM userData WHERE organization = :organization AND group_name = :group_name');
            $stmt->bindParam(':organization', $organization, PDO::PARAM_STR);
            $stmt->bindParam(':group_name', $group_name, PDO::PARAM_STR);
            $stmt->execute();
            foreach ($stmt as $row) {
                if ($row[0] > 0) {
                    echo json_encode('already exists');
                    return false;
                }
            }
        } catch (\Exception $e) {
        }
        try {
            $stmt = $pdo->prepare('INSERT INTO userData (organization, password, group_name) VALUES (:organization, :password, :group_name)');
            $stmt->bindParam(':organization', $organization, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->bindParam(':group_name', $group_name, PDO::PARAM_STR);
            $stmt->execute();
            echo json_encode('success');
            return false;
        } catch (\Exception $e) {
            echo json_encode('error');
            return false;
        }
    }
    // グループ追加処理
} elseif ($_POST['ajax'] == 'addGroup') {
    $password = $_POST['password'];
    $group_name = $_POST['group'];
    $admin = $_POST['admin'];
    if ($password == '' || $password == null || $group_name == '' || $group_name == null || $admin == '' || $admin == null) {
        echo json_encode('error');
    } else {
        $password = password_hash($password, PASSWORD_DEFAULT);
        $admin = password_hash($admin, PASSWORD_DEFAULT);
        try {
            $stmt = $pdo->prepare('SELECT count(*) FROM groups WHERE group_name = :group_name');
            $stmt->bindParam(':group_name', $group_name, PDO::PARAM_STR);
            $stmt->execute();
            foreach ($stmt as $row) {
                if ($row[0] > 0) {
                    echo json_encode('already exists');
                    return false;
                }
            }
        } catch (\Exception $e) {
        }
        try {
            $stmt = $pdo->prepare('INSERT INTO groups (group_name, password, admin) VALUES (:group_name, :password, :admin)');
            $stmt->bindParam(':group_name', $group_name, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->bindParam(':admin', $admin, PDO::PARAM_STR);
            $stmt->execute();
            echo json_encode('success');
            return false;
        } catch (\Exception $e) {
            echo json_encode('error');
            return false;
        }
    }
    // グループ参加処理
} elseif ($_POST['ajax'] == 'joinGroup') {
    $group_name = $_POST['group_name'];
    $password = $_POST['password'];
    $admin = $_POST['admin'];
    if ($admin == null || $admin == '') {
        try {
            $stmt = $pdo->prepare('SELECT * FROM groups where group_name = :group_name');
            $stmt->bindParam(':group_name', $group_name, PDO::PARAM_STR);
            $stmt->execute();
            $group_password = null;
            foreach ($stmt as $row) {
                $group_password = $row['password'];
            }
            if (password_verify($password, $group_password)) {
                echo json_encode('normal_success');
                return false;
            } else {
                echo json_encode('error');
                return false;
            }
        } catch (\Exception $e) {
            echo json_encode('error');
            return false;
        }
    } else {
        try {
            $stmt = $pdo->prepare('SELECT * FROM groups where group_name = :group_name');
            $stmt->bindParam(':group_name', $group_name, PDO::PARAM_STR);
            $stmt->execute();
            $admin_password = null;
            foreach ($stmt as $row) {
                $admin_password = $row['admin'];
            }
            if (password_verify($admin, $admin_password)) {
                echo json_encode('admin_success');
                return false;
            } else {
                echo json_encode('error');
                return false;
            }
        } catch (\Exception $e) {
            echo json_encode('error');
            return false;
        }
    }
}
