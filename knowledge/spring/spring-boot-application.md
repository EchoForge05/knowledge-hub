# Spring Boot 应用入口注解

## 三项能力

`@SpringBootApplication` 组合自动配置、组件扫描和应用配置声明。它对应 `@EnableAutoConfiguration`、`@ComponentScan` 和 `@SpringBootConfiguration`。

默认组件扫描从应用类所在包展开。组织代码时应考虑入口类的位置，避免将需要扫描的组件放到无关的包树。

## 入口结构

```java
@org.springframework.boot.autoconfigure.SpringBootApplication
public class Application {
    public static void main(String[] args) {
        org.springframework.boot.SpringApplication.run(Application.class, args);
    }
}
```

该片段按 Spring Boot 4.1.2 资料整理，需要已有兼容项目与依赖，不能独立作为完整项目编译；未运行验证。

<details>
<summary>适用范围与官方来源</summary>

适用环境：Spring Boot 4.1.2 参考文档；核查日期：2026-10-31。示例仅展示入口结构，未安装或运行 Spring 应用。

[Spring Boot：Using the @SpringBootApplication Annotation](https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html)。该地址会随官方当前版本更新；本文记录的是上述核查时版本。

</details>
