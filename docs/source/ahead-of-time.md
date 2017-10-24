---
title: Ahead-of-Time Compilation
---

<h2 id="overview">Overview</h2>

Before the browser can render the application, the components and templates must be converted to executable JavaScript by the *Angular compiler*.

There are two ways to compile the Application: *Just-in-Time (JiT)* and *Ahead-of-time (AoT)*.

<h3 id="overview-jit">Just-in-Time (JiT)</h3>

With JiT, you compile the app in the browser, at runtime, as the application loads.

As follows in [Angular Documentation](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html):

> JiT compilation incurs a runtime performance penalty. Views take longer to render because of the in-browser compilation step. The application is bigger because it includes the Angular compiler and a lot of library code that the application won't actually need. Bigger apps take longer to transmit and are slower to load.


<h3 id="overview-aot">Ahead-of-Time (AoT)</h3>

With AoT, the browser loads code of the application that has been pre-compiled at build time. It means the application can render immediately.

Other benefits:

- Faster rendering
- Fewer asynchronous requests
- Smaller Angular framework download size
- Detect template errors earlier
- Better security


<h2 id="compile-aot">Compile with AoT</h2>

To learn more about Ahead-of-Time compilation, please take a look at [the chapter "Ahead-of-Time Compilation"](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html) on *angular.io* that explain all about AoT.

<h2 id="example">An Example</h2>

We prepared [an example](https://github.com/apollographql/apollo-angular/tree/master/examples/hello-world) that shows how to use *Ahead-of-Time* compilation with *Apollo*.
