pipeline {
    agent any

    environment {
        // Use existing CI/CD infrastructure
        REGISTRY = 'registry.lan:5000'
        RPI_IP = '192.168.1.9'

        // Project settings
        PROJECT_NAME = 'portfolio'
        COMPOSE_FILE = 'docker-compose.staging.yml'

        // Expo/EAS settings
        EXPO_TOKEN = credentials('expo-token')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "Branch: ${GIT_BRANCH}, Commit: ${GIT_COMMIT}"'
            }
        }

        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh '''
                                python3 -m venv .venv
                                . .venv/bin/activate
                                pip install -r requirements.txt
                                pytest --tb=short --cov=app --cov-report=term || true
                            '''
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            sh '''
                                npm ci
                                npm run lint || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Images') {
            parallel {
                stage('Backend Image') {
                    steps {
                        dir('backend') {
                            sh '''
                                podman build -t ${REGISTRY}/${PROJECT_NAME}-backend:${BUILD_NUMBER} .
                                podman build -t ${REGISTRY}/${PROJECT_NAME}-backend:latest .
                                podman push ${REGISTRY}/${PROJECT_NAME}-backend:${BUILD_NUMBER}
                                podman push ${REGISTRY}/${PROJECT_NAME}-backend:latest
                            '''
                        }
                    }
                }
                stage('Admin Image') {
                    steps {
                        dir('admin') {
                            sh '''
                                podman build \
                                    --build-arg NEXT_PUBLIC_API_URL=http://${RPI_IP}:5003/api/v1 \
                                    -t ${REGISTRY}/${PROJECT_NAME}-admin:${BUILD_NUMBER} .
                                podman build \
                                    --build-arg NEXT_PUBLIC_API_URL=http://${RPI_IP}:5003/api/v1 \
                                    -t ${REGISTRY}/${PROJECT_NAME}-admin:latest .
                                podman push ${REGISTRY}/${PROJECT_NAME}-admin:${BUILD_NUMBER}
                                podman push ${REGISTRY}/${PROJECT_NAME}-admin:latest
                            '''
                        }
                    }
                }
                stage('Frontend Image') {
                    steps {
                        dir('frontend') {
                            sh '''
                                podman build \
                                    --build-arg EXPO_PUBLIC_API_URL=http://${RPI_IP}:5003/api/v1 \
                                    -t ${REGISTRY}/${PROJECT_NAME}-frontend:${BUILD_NUMBER} .
                                podman build \
                                    --build-arg EXPO_PUBLIC_API_URL=http://${RPI_IP}:5003/api/v1 \
                                    -t ${REGISTRY}/${PROJECT_NAME}-frontend:latest .
                                podman push ${REGISTRY}/${PROJECT_NAME}-frontend:${BUILD_NUMBER}
                                podman push ${REGISTRY}/${PROJECT_NAME}-frontend:latest
                            '''
                        }
                    }
                }
            }
        }

        stage('Build APK') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                        npm install -g eas-cli || true
                        npx eas-cli login --token ${EXPO_TOKEN}

                        # Use EAS cloud build (faster than local on RPi)
                        npx eas-cli build --platform android --profile preview --non-interactive --no-wait || true

                        echo "APK build started on EAS. Check expo.dev for status."
                    '''
                }
            }
        }

        stage('Deploy Staging') {
            steps {
                sh '''
                    # Stop existing containers
                    podman-compose -f ${COMPOSE_FILE} -p ${PROJECT_NAME} down || true

                    # Pull latest images
                    podman pull ${REGISTRY}/${PROJECT_NAME}-backend:latest
                    podman pull ${REGISTRY}/${PROJECT_NAME}-admin:latest
                    podman pull ${REGISTRY}/${PROJECT_NAME}-frontend:latest

                    # Start staging
                    podman-compose -f ${COMPOSE_FILE} -p ${PROJECT_NAME} up -d

                    # Wait for services
                    sleep 15

                    # Health check
                    curl -sf http://localhost:5003/health || echo "Backend health check pending..."
                '''
            }
        }

        stage('Notify') {
            steps {
                script {
                    emailext(
                        subject: "Portfolio Build #${BUILD_NUMBER} - ${currentBuild.currentResult}",
                        body: """
                            <h2>Portfolio CI/CD Build</h2>
                            <p><b>Build:</b> #${BUILD_NUMBER}</p>
                            <p><b>Branch:</b> ${env.GIT_BRANCH}</p>
                            <p><b>Status:</b> ${currentBuild.currentResult}</p>

                            <h3>Staging URLs:</h3>
                            <ul>
                                <li>Frontend: <a href="http://${RPI_IP}:8084">http://${RPI_IP}:8084</a></li>
                                <li>Admin: <a href="http://${RPI_IP}:3002">http://${RPI_IP}:3002</a></li>
                                <li>API Docs: <a href="http://${RPI_IP}:5003/api/v1/docs">http://${RPI_IP}:5003/api/v1/docs</a></li>
                            </ul>

                            <p>APK build queued on EAS (check expo.dev)</p>
                            <p><a href="${BUILD_URL}">View Build</a></p>
                        """,
                        to: '${DEFAULT_RECIPIENTS}',
                        mimeType: 'text/html'
                    )
                }
            }
        }
    }

    post {
        failure {
            emailext(
                subject: "FAILED: Portfolio Build #${BUILD_NUMBER}",
                body: "Build failed. <a href='${BUILD_URL}console'>View logs</a>",
                to: '${DEFAULT_RECIPIENTS}',
                mimeType: 'text/html'
            )
        }
        always {
            cleanWs(deleteDirs: true, patterns: [
                [pattern: '**/node_modules/**', type: 'INCLUDE'],
                [pattern: '**/.venv/**', type: 'INCLUDE']
            ])
        }
    }
}
