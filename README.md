# laser-propulsion-calculator
Breakthrough Starshot laser propulsion calculator

# Contribution Guide

## Tooling
We use the AirBNB style guide for all of our Javascript code:
https://github.com/airbnb/javascript

We use JSDoc for documenting our Javascript code:
http://usejsdoc.org

## Code Overview
The calculator uses a JSON-style format to specify inputs and outputs.

For example, if we want to specify an input called "Payload". In the "inputs" object variable, we would add the following JSON object:

```
m0_payload_mass: {
  label: 'Payload',
  unit: {
    kg: kg,
  },
  val: 0.001,
}
```

This creates an input box where users specify the payload mass in kg. The input will default to 0.001kg. "m0_payload_mass" won't be seen by the user, but is the variable name we will refer to if we want to calculate an output based on the payload mass. Let's see how that works.

If we want to specify an output called "Total Mass". In the "outputs" object variable, we would add the following JSON object:

```
m_total_mass: {
  label: 'Total Mass',
  unit: {
    g: g,
  },
  update() {
    this.val = inputs.m0_payload_mass.val + outputs.m_sail.val;
  },
}
```

This creates a text element, which displays the "Total Mass" in grams. The update() function is how we actually compute this output. As you can see, inputs.m0_payload_mass.val is actually the value of the "Payload" input we created above, and "outputs.m_sail.val" is an output that was computed before this one (if "outputs.m_sail.val" was declared below this one, it would not work).

And that's the basic overview. Here's one more important detail:

In addition to the "inputs" and "outputs" objects, we have the "hiddens" object variable, which work in a similar way to "outputs", but they don't show up on the user interface.

