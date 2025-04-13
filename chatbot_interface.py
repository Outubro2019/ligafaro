#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import json
import subprocess
import os

def clear_screen():
    """Limpa a tela do terminal"""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header():
    """Imprime o cabeçalho do chatbot"""
    print("\n" + "=" * 80)
    print("                        CHATBOT LIGA FARO - INTERFACE LOCAL")
    print("=" * 80)
    print("\nFaça perguntas sobre eventos, notícias, voluntariado ou a comunidade de Faro.")
    print("Digite 'sair' para encerrar.\n")

def ask_chatbot(question):
    """Envia uma pergunta para o chatbot e retorna a resposta"""
    try:
        # Caminho para o script do chatbot
        chatbot_script = os.path.join("src", "services", "python", "chatbot.py")
        
        # Executa o script do chatbot com a pergunta como argumento
        result = subprocess.run(
            ["python", chatbot_script, question],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Processa a saída JSON
        try:
            response = json.loads(result.stdout)
            return response.get("answer", "Não consegui processar sua pergunta.")
        except json.JSONDecodeError:
            print(f"Erro ao decodificar a resposta: {result.stdout}")
            return "Erro ao processar a resposta do chatbot."
    
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar o chatbot: {e}")
        print(f"Saída de erro: {e.stderr}")
        return "Ocorreu um erro ao processar sua pergunta."

def main():
    """Função principal do programa"""
    clear_screen()
    print_header()
    
    while True:
        # Solicita uma pergunta ao usuário
        question = input("\n👤 Você: ")
        
        # Verifica se o usuário quer sair
        if question.lower() in ['sair', 'exit', 'quit']:
            print("\nObrigado por usar o Chatbot Liga Faro! Até logo! 👋\n")
            break
        
        # Envia a pergunta para o chatbot
        print("\n🤖 Chatbot: ", end="")
        answer = ask_chatbot(question)
        
        # Formata e exibe a resposta
        for line in answer.split('\n'):
            if line.strip():
                print(line)
    
if __name__ == "__main__":
    main()