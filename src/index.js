import ReactDOM from "react-dom";
import React, { useRef, useState, useEffect } from "react";
import {
  Illustration,
  Ellipse,
  Shape,
  RoundedRect,
  useRender
} from "react-zdog";
// New react-spring target, for native animation outside of React
import { a, useSpring } from "react-spring/zdog";
import "./styles.css";

/** --- Basic, re-usable shapes -------------------------- */
const TAU = Math.PI * 2;
const Eye = props => (
  <Ellipse
    diameter={1.5}
    quarters={2}
    translate={{ x: -2.2, y: 0, z: 4.5 }}
    rotate={{ z: -TAU / 4 }}
    color="#444B6E"
    stroke={0.5}
    {...props}
  />
);

const Leg = props => (
  // Quads
  <a.Shape
    path={[{ y: 0 }, { y: 6 }]}
    translate={{ x: -3 }}
    color="#747B9E"
    stroke={2}
    {...props}
  >
    {/* Leg */}
    <Shape
      path={[{ y: 0 }, { y: 6 }]}
      translate={{ y: 6 }}
      rotate={{ x: -TAU / 8 }}
      color="#747B9E"
      stroke={2}
    />
    {/* Shoe */}
    <RoundedRect
      width={2}
      height={4}
      cornerRadius={1}
      translate={{ y: 11.8, z: -4 }}
      rotate={{ x: TAU / 6 }}
      color="#444B6E"
      fill
      stroke={1}
    />
  </a.Shape>
);
const Arm = props => {
  const { rotation } = useSpring({
    rotation: props.up ? -Math.PI / 4 : Math.PI / 2
  });

  return (
    // Bicep
    <a.Shape
      path={[{ y: 0 }, { y: 4 }]}
      translate={{ x: -5, y: -2 }}
      color="#F0F2EF"
      color="#EA0"
      stroke={3}
      {...props}
    >
      <a.Shape
        translate={{ y: 6 }}
        color="#F0F2EF"
        rotate={rotation.interpolate(r => ({ x: TAU / 4 - r }))}
      >
        {/* Forearm */}
        <a.Shape
          path={[{ y: 0 }, { y: 5 }]}
          // rotate={{ x: TAU / 8 }}
          color="#EA0"
          stroke={2}
        />
        {/* Hand */}
        <Shape
          translate={{ z: 0, y: 6, x: 0 }}
          stroke={3}
          color="#EA0"
          rotate={rotation.interpolate(r => ({ x: TAU / 4 - r }))}
        />
      </a.Shape>
    </a.Shape>
  );
};

/** --- Assembly ----------------------------------------- */
function Guy() {
  // Change motion every second
  const [up, setUp] = useState(true);
  useEffect(
    () => void setInterval(() => setUp(previous => !previous), 450),
    []
  );
  // Turn static values into animated values
  const { rotation } = useSpring({
    rotation: up ? 0 : Math.PI
  });
  // useRender allows us to hook into the render-loop
  const ref = useRef();
  let t = 0;
  useRender(() => (ref.current.rotate.y = Math.cos((t += 0.05) / TAU)));

  return (
    //Lekani
    <Ellipse ref={ref} path={[{ x: -4 }, { x: 4 }]} stroke={6} color="#747B9E">
      <a.Anchor>
        {/* Body */}
        <Shape
          path={[{ x: -1.5 }, { x: 1.5 }]}
          translate={{ y: -5.5 }}
          stroke={9}
          color="#E1E5EE"
        >
          {/* Head */}
          <a.Shape stroke={11} translate={{ y: -9.5 }} color={"#EA0"}>
            {/* Cap front */}
            <Shape
              translate={{ x: 0, y: -2, z: -4 }}
              stroke={8}
              color="#747B9E"
            />
            {/* Cap Back*/}
            <Ellipse
              diameter={6}
              rotate={{ x: -TAU / 10 }}
              translate={{ y: -4, z: -1 }}
              stroke={4}
              color="#444B6E"
              fill
            />
            {/* Eyes */}
            <Eye />
            <Eye translate={{ x: 2.2, z: 4.5 }} />
            {/* Mouth */}
            <a.Ellipse
              diameter={1.3}
              scale={0.4}
              translate={{ y: 2, z: 4.5 }}
              rotate={{ z: TAU / 4 }}
              closed
              color="#444B6E"
              stroke={0.5}
              fill
            />
          </a.Shape>

          {/* Arms */}
          <Arm />
          <Arm
            translate={{ x: 5, y: -2 }}
            up={up}
            // rotate={rotation.interpolate(r => ({ x: TAU / 4 - r }))}
          />
        </Shape>
      </a.Anchor>
      {/* Legs */}
      <Leg />
      <Leg translate={{ x: 3 }} />
    </Ellipse>
  );
}

ReactDOM.render(
  <Illustration zoom={8}>
    <Guy />
    <Ellipse
      translate={{ y: 20 }}
      diameter={10}
      rotate={{ x: -TAU / 3.5 }}
      color="#363642"
      fill
    />
  </Illustration>,
  document.getElementById("root")
);
