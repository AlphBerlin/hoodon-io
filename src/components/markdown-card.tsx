import React from 'react';
import {motion} from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const MarkdownCard = ({content}: { content: string }) => {
    // @ts-ignore
    return (
        <div className="p-4 w-full max-w-4xl mx-auto">
            <motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.5, ease: "easeOut"}}
                whileHover={{y: -5}}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
                {/* Mac-style window dots */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <motion.div
                        initial={{x: -20, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        transition={{delay: 0.2}}
                        className="flex space-x-2"
                    >
                        <div className="h-3 w-3 rounded-full bg-red-500"/>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"/>
                        <div className="h-3 w-3 rounded-full bg-green-500"/>
                    </motion.div>
                </div>

                {/* Markdown Content */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.3}}
                    className="p-6"
                >
                    <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2" {...props} />,
                                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                em: ({node, ...props}) => <em className="italic" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                code: ({node, ...props}) =>
                                    <code className="block bg-gray-100 dark:bg-gray-800 rounded p-4 my-4" {...props} />
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </motion.div>
            </motion.div>
        </div>)
};

export default MarkdownCard;