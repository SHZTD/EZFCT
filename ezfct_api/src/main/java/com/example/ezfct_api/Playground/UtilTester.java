package com.example.ezfct_api.Playground;
import com.example.ezfct_api.Security.AESUtil;

// Esta clase no se utiliza en ningun momento en la API, asi que
// ningun servicio se esta levantando aqui
public class UtilTester {
    public static void main(String[] args) throws Exception {
        String adminString = AESUtil.encrypt("admin");
        String passwordString = AESUtil.encrypt("test");
        System.out.println("Username: " + adminString + "\nPassword: " + passwordString + "\n++++++");

        String decryptedUsr = AESUtil.decrypt("WvnsEoiXKKLyThisfvvpfg==");
        String decryptedPw = AESUtil.decrypt("mu4uFioqI4e6pl0uNLQDUQ==");
        System.out.println("Decrypted: " + decryptedUsr + "\nDecrypted password: " + decryptedPw);
    }
}
