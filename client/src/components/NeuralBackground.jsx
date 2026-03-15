import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function NeuralBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="neural-bg"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: false,
        },
        background: {
          color: "transparent",
        },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: {
            value: 65,
            density: {
              enable: true,
              area: 900,
            },
          },
          color: {
            value: ["#38bdf8", "#8b5cf6", "#ec4899"],
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.7,
          },
          size: {
            value: { min: 1, max: 4 },
          },
          links: {
            enable: true,
            distance: 140,
            color: "#8b5cf6",
            opacity: 0.3,
            width: 1,
            triangles: {
              enable: false,
            },
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "bounce",
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            onClick: {
              enable: false,
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 180,
              links: {
                opacity: 0.6,
              },
            },
          },
        },
      }}
      className="absolute inset-0 -z-10"
    />
  );
}