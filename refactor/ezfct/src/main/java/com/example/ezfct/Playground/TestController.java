// este controller esta por estar, es solo para testear
// la primera vez de la API con sus endpoints

package com.example.ezfct.Playground;
import com.example.ezfct.Controller.DTONumber;
import com.example.ezfct.Controller.DTOString;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(TestController.ENDPOINT_ROUTE)
@CrossOrigin("*") // para localhost

public class TestController {
    public static final String ENDPOINT_ROUTE = "test";

    @GetMapping("/intParameter")
    public ResponseEntity<DTONumber> returnNumber(@RequestParam int v) {
        // response entity toma de parametro un tipo de DTO normalmente
        DTONumber response = new DTONumber(v);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stringParameter")
    public ResponseEntity<DTOString> returnString(@RequestParam String data) {
        DTOString response = new DTOString(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/calculator")
    public ResponseEntity<DTONumber> returnSum(@RequestParam int a, @RequestParam int b) {
        DTONumber response = new DTONumber(a + b);
        return ResponseEntity.ok(response);
    }
}
