import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function TechBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tech-bg"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        background: {
          color: "transparent",
        },
        particles: {
          number: {
            value: 70,
            density: { enable: true, area: 800 },
          },
          color: {
            value: "#6366f1",
          },
          links: {
            enable: true,
            color: "#6366f1",
            distance: 150,
            opacity: 0.35,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
          },
          size: {
            value: { min: 1, max: 3 },
          },
          opacity: {
            value: 0.6,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 200,
              links: {
                opacity: 0.6,
              },
            },
          },
        },
      }}
    />
  );
}