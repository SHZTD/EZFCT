package com.example.ezfct.Repository;

import com.example.ezfct.Entity.Postulacion;
import com.example.ezfct.Entity.Practicas;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostulacionRepository extends JpaRepository<Postulacion, Integer> {
    List<Postulacion> findByAlumnoIdAlumno(int idAlumno);
    List<Postulacion> findByPractica(Practicas practica);


    @EntityGraph(attributePaths = {"alumno", "practica"})
    List<Postulacion> findByPracticaIdPractica(int idPractica);

    @EntityGraph(attributePaths = {"alumno"})
    Optional<Postulacion> findByIdPostulacion(int idPostulacion);

    /*
            La anotacipn @EntityGraph en Spring Data JPA se utiliza para definir de forma explicita que relaciones
            (entidades asociadas) deben ser cargadas junto con una entidad principal, optimizando el rendimiento al
            evitar el problema de N+1 queries.
     */
}
