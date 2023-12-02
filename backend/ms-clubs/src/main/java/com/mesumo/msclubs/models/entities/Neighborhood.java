package com.mesumo.msclubs.models.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Neighborhood {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    String name;
}
