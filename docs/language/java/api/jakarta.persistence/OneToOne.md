# [OneToOne](https://jakarta.ee/specifications/platform/10/apidocs/jakarta/persistence/onetoone)

```java
@Target({METHOD,FIELD})
@Retention(RUNTIME)
public @interface OneToOne
```

指定了与另一个实体的一对一多重性（one-to-one multiplicity）的单值关联。通常不需要显式指定关联的目标实体，因为它通常可以从所引用对象的类型中推断出来。如果关系是双向的，非拥有方必须使用 `OneToOne` 注解的 `mappedBy` 元素来指定拥有方的关系字段或属性。

`OneToOne` 注解可以在可嵌入类（embeddable class）中使用，以指定从该可嵌入类到实体类的关系。如果关系是双向的，并且包含该可嵌入类的实体位于关系的拥有方，那么非拥有方必须使用 `OneToOne` 注解的 `mappedBy` 元素来指定可嵌入类中的关系字段或属性。在 `mappedBy` 元素中必须使用点（"."）符号语法来指示嵌套属性中的关系属性。点语法中使用的每个标识符的值是各自嵌套字段或属性的名称。

**示例 1：映射外键列的一对一关联**

```java
// Customer 类中的代码：

@OneToOne(optional=false)
@JoinColumn(
    name="CUSTREC_ID", unique=true, nullable=false, updatable=false)
public CustomerRecord getCustomerRecord() { return customerRecord; }

// CustomerRecord 类中的代码：

@OneToOne(optional=false, mappedBy="customerRecord")
public Customer getCustomer() { return customer; }
```

**示例 2：源和目标共享相同主键值的一对一关联**

```java
// Employee 类中的代码：

@Entity
public class Employee {
    @Id Integer id;

    @OneToOne @MapsId
    EmployeeInfo info;
    ...
}

// EmployeeInfo 类中的代码：

@Entity
public class EmployeeInfo {
    @Id Integer id;
    ...
}
```

**示例 3：从可嵌入类到另一个实体的一对一关联**

```java
@Entity
public class Employee {
   @Id int id;
   @Embedded LocationDetails location;
   ...
}

@Embeddable
public class LocationDetails {
   int officeNumber;
   @OneToOne ParkingSpot parkingSpot;
   ...
}

@Entity
public class ParkingSpot {
   @Id int id;
   String garage;
   @OneToOne(mappedBy="location.parkingSpot") Employee assignedTo;
   ...
}
```

## 元素详细信息

### optional

```java
boolean optional
```

（可选）该关联是否是可选的。如果设置为 `false`，则必须始终存在非空的关系。

**默认值**：true