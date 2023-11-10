# num = {0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'}

# str = input()

# numbers = str.split()

# final_op = ""

# for ele in numbers:
#     for key, val in num.items():
#         if ele.lower() == val:
#             final_op += str(key)

# print(final_op)


num = {0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'}

user_input = input("Enter words to convert to numbers (separated by spaces): ")

words = user_input.lower().split()
final_output = ""

for word in words:
    if word in num.values():
        for key, value in num.items():
            if value == word:
                final_output += str(key)
                # final_output += " "
    else:
        final_output += "Not Found "

print("Converted numbers:", final_output.strip())
