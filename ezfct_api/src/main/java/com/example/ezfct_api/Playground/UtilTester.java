package com.example.ezfct_api.Playground;
import com.example.ezfct_api.Security.AESUtil;

// Esta clase no se utiliza en ningun momento en la API, asi que
// ningun servicio se esta levantando aqui
public class UtilTester {
    public static void main(String[] args) throws Exception {
        String userString = AESUtil.encrypt("admin");
        String passwordString = AESUtil.encrypt("test");
        int v = 1;
        System.out.println("Username: " + userString + "\nPassword: " + passwordString + "\n++++++");

        System.out.println("insert into login values(" + v + ", '" + userString + "', '" + passwordString + "');");
        //String decryptedUsr = AESUtil.decrypt("WvnsEoiXKKLyThisfvvpfg==");
        //String decryptedPw = AESUtil.decrypt("mu4uFioqI4e6pl0uNLQDUQ==");
        //System.out.println("Decrypted: " + decryptedUsr + "\nDecrypted password: " + decryptedPw);
    }
}
