<template>
    <div class="boxWrapper" :class="gameOver ? 'disabled-box': ''">
        <div v-for="(config, rowIndex) in boxConfig" class="row">
            <input 
            v-for="(squares, columnIndex) in Array.from(Array(config).keys())"
            :key="columnIndex"
            :ref="`${rowIndex}-${columnIndex}`"
            maxlength="1"
            class="wordInputStyle column"
            type="text" 
            @input="(e) => saveWordByRow(rowIndex, e.target.value, columnIndex)" 
            :class="evaluateLetter(rowIndex, columnIndex)">
        </div>
    </div>
    <div v-if="dailyWord">
        {{ this.dailyWord }}
    </div>
    <div v-else>
        loading word
    </div>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import WordleClient from "../../service/WordleClient.ts";

interface Word {
    row: {
        word: string,
        done: boolean;
    };
}

export default defineComponent({
    name: 'worldle-box',
    data() {
        return {
            boxConfig: [5, 5, 5, 5, 5, 5] as Array<number>,
            dailyWord: "" as string,
            allWords: [] as Array<string>,
            wordByRow: {} as Word,
            completedWords: [] as Array<Word>,
            gameOver: false as boolean,
        }
    },
    methods: {
        async fetchDailyWord(): string {
            const dailyWords = await WordleClient.fetchDailyWords()
            this.allWords = dailyWords.data;
            return dailyWords.data[this.getRandomNumberWithLimit(dailyWords.data.length)];

        },
        getRandomNumberWithLimit(limit: number): number {
            const numberByLimit = Number.parseInt(Math.random()*limit)
            return numberByLimit;
        },
        saveWordByRow(rowIndex: string, letter: string, columnIndex: string) {
            if (!this.wordByRow[rowIndex]) {
                this.wordByRow[rowIndex] = {
                    word: ''
                }
            }
            this.wordByRow[rowIndex].word += letter;
            if (this.wordByRow[rowIndex].word.length === 5) {
                this.wordByRow[rowIndex].done = true;
                if (!this.allWords.includes(this.wordByRow[rowIndex]?.word.toUpperCase())) {
                    alert("Not in word list")
                } else if(this.wordByRow[rowIndex].word.toUpperCase() === this.dailyWord ) {
                    alert("Congratz!")
                    this.gameOver = true;
                }
            }
            const nextRowIndex = columnIndex === 4 ? rowIndex + 1 : rowIndex;
            const nextColumnIndex = columnIndex === 4 ? 0 : columnIndex + 1;
            this.focusNextInput(`${nextRowIndex}-${nextColumnIndex}`);
        },
        focusNextInput(refId) {
            if (!this.gameOver) {
                const nextRef = this.$refs[refId];
                nextRef[0].focus();
            }
        },
        evaluateLetter(rowIndex: string, columnIndex: string) {
            // valida que la palabra para la columna esté completa
            if (this.wordByRow[rowIndex]?.done) {
                const dailyWordArray = this.dailyWord.split("");
                if (this.wordByRow[rowIndex]?.word[columnIndex].toUpperCase() === dailyWordArray[columnIndex]) {
                    return 'background-match';
                } else if (dailyWordArray.includes(this.wordByRow[rowIndex]?.word[columnIndex].toUpperCase())) {
                    return 'background-partial-match';
                } else {
                    return 'background-nomatch';
                }
            } else {
                return 'background-default';
            }
        }
    },
    mounted() {
        // busca las palabras del día
        this.fetchDailyWord().then(response => {
            this.dailyWord = response;
        });


        // focus en el primer cuadrito
        this.focusNextInput('0-0');
    }
})
</script>

<style lang="css">

    .background-nomatch {
        background: #3A3A3B !important;
    }

    .background-match {
        background: #538D4E !important;
    }

    .background-partial-match {
        background: #B59F3B !important;
    }

    .disabled-box {
        pointer-events: none;
    }

    .wordInputStyle {
        -webkit-appearance: none;
        color: #FFF;
        text-transform: capitalize;
        background: #121213;
        outline: none !important;
        height: 100%;
        width: 100%;
        font-size: 32px;
        text-align: center;
        margin: 0;
        padding: 0;
        border: none;
    }


    .boxWrapper {
        padding: 80px;
        background: black;
    }

    .row {
        display: flex;
        justify-content: center;
    }

    .column {
        margin: 5px;
        background: #121213;
        padding: 15px;
        height: 30px;
        width: 30px;
        border: 2px solid #3A3A3C;

    }
</style>