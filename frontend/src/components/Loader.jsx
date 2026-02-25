import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="flex-center" style={{ height: '80vh', gap: '8px' }}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '50%'
                    }}
                    animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

export default Loader;
